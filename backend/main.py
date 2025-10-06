from fastapi import FastAPI, UploadFile
from fastapi.responses import FileResponse
import shutil, os, subprocess
import zipfile


from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


# Allow React frontend to call FastAPI


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"


OUTPUT_DIR = "separated"


os.makedirs(UPLOAD_DIR, exist_ok=True)


os.makedirs(OUTPUT_DIR, exist_ok=True)


@app.get("/")
def root():

    return {"message": "Welcome to the Demucs audio splitting backend!", "status": "ok"}


@app.post("/split")
async def split_track(file: UploadFile):

    # Save uploaded files

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:

        shutil.copyfileobj(file.file, f)

    # Run Demucs

    subprocess.run(["demucs", "--out", OUTPUT_DIR, file_path])

    # Zip the output folder

    base_name = os.path.splitext(file.filename)[0]

    # MODELS NAME

    model_name = "htdemucs"  # default model

    folder_to_zip = os.path.join(OUTPUT_DIR, model_name, base_name)

    zip_path = os.path.join(OUTPUT_DIR, f"{base_name}.zip")

    with zipfile.ZipFile(zip_path, "w") as zipf:

        for root, dirs, files in os.walk(folder_to_zip):

            for file_in in files:

                file_path_in = os.path.join(root, file_in)

                arcname = os.path.relpath(file_path_in, folder_to_zip)

                zipf.write(file_path_in, arcname=arcname)

    return FileResponse(
        zip_path, media_type="application/zip", filename=f"{base_name}_stems.zip"
    )
