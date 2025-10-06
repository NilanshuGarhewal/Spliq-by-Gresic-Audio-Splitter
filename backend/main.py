from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil, os, subprocess, zipfile, tempfile

app = FastAPI()

# ✅ Only allow requests from your frontend in production
FRONTEND_URL = os.environ.get("FRONTEND_URL", "*")  # Use your frontend URL in env
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temp directories for uploads and outputs
UPLOAD_DIR = tempfile.mkdtemp(prefix="uploads_")
OUTPUT_DIR = tempfile.mkdtemp(prefix="separated_")

# Supported Demucs models
SUPPORTED_MODELS = ["htdemucs", "hdemucs_mmi", "mdx", "mdx_extra", "mdx_extra_q"]

@app.get("/")
def root():
    return {"message": "Welcome to the Demucs audio splitting backend!", "status": "ok"}

@app.post("/split")
async def split_track(file: UploadFile, model: str = Form("htdemucs")):
    # Validate model
    if model not in SUPPORTED_MODELS:
        return {"error": f"Invalid model! Choose one of: {', '.join(SUPPORTED_MODELS)}"}

    # Save uploaded file
    upload_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(upload_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Run Demucs
    try:
        result = subprocess.run(
            ["demucs", "-n", model, "--out", OUTPUT_DIR, upload_path],
            capture_output=True,
            text=True,
            check=True  # Raises CalledProcessError if Demucs fails
        )
    except subprocess.CalledProcessError as e:
        return {"error": f"Demucs failed: {e.stderr}"}

    # Find Demucs output folder dynamically
    base_name = os.path.splitext(file.filename)[0]
    output_folder = None
    for root_dir in os.listdir(OUTPUT_DIR):
        potential_path = os.path.join(OUTPUT_DIR, root_dir, base_name)
        if os.path.exists(potential_path):
            output_folder = potential_path
            break

    if not output_folder:
        return {"error": "Demucs output folder not found"}

    # Create ZIP of the separated stems
    zip_path = os.path.join(tempfile.gettempdir(), f"{base_name}_{model}.zip")
    with zipfile.ZipFile(zip_path, "w") as zipf:
        for root_dir, _, files in os.walk(output_folder):
            for fname in files:
                fpath = os.path.join(root_dir, fname)
                arcname = os.path.relpath(fpath, output_folder)
                zipf.write(fpath, arcname)

    # Optional: Cleanup uploaded file & Demucs output
    try:
        os.remove(upload_path)
        shutil.rmtree(os.path.join(OUTPUT_DIR, model), ignore_errors=True)
    except Exception:
        pass  # Ignore cleanup errors

    return FileResponse(
        zip_path,
        media_type="application/zip",
        filename=f"{base_name}_{model}_stems.zip",
    )
