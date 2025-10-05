import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// COMPONENTS
import Header from "../Header/Header";
import InputBox from "../InputBox/InputBox";
import SelectedItem from "../SelectedItem/SelectedItem";
import StemPlayer from "../StemPlayer/StemPlayer";

// STYLESHEETS
import "./Splitter.scss";
import "./InputContainer.scss";
import "./OutputContainer.scss";

const Splitter = () => {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stems, setStems] = useState([]);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const progressBarRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAudioURL(URL.createObjectURL(selectedFile));
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAudioURL(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setStems([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [audioURL]);

  const handleSeek = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (t) => {
    if (isNaN(t)) return "0:00";
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${min}:${sec}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/split",
        formData,
        {
          responseType: "blob",
        }
      );

      const zipBlob = new Blob([response.data], { type: "application/zip" });
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(zipBlob);
      const extracted = [];

      for (const filename of Object.keys(zip.files)) {
        const fileData = await zip.files[filename].async("blob");
        const url = URL.createObjectURL(fileData);
        extracted.push({ name: filename, url });
      }
      setStems(extracted);
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-section">
      <Header />

      <div className="input-container">
        <div className="input-header">
          <span className="title">Input</span>
        </div>

        <div className="input-wrapper">
          {!file ? (
            <InputBox
              handleFileChange={handleFileChange}
              fileInputRef={fileInputRef}
            />
          ) : (
            <SelectedItem
              file={file}
              togglePlayPause={togglePlayPause}
              isPlaying={isPlaying}
              progress={progress}
              progressBarRef={progressBarRef}
              handleSeek={handleSeek}
              currentTime={currentTime}
              duration={duration}
              formatTime={formatTime}
              handleReset={handleReset}
              handleUpload={handleUpload}
              loading={loading}
              audioRef={audioRef}
              audioURL={audioURL}
            />
          )}
        </div>
      </div>

      {stems.length > 0 && (
        <div className="output-container">
          <div className="output-header">
            <span className="title">Output</span>
          </div>
          <div className="output-wrapper">
            {stems.map((stem, i) => (
              <StemPlayer key={i} stem={stem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Splitter;
