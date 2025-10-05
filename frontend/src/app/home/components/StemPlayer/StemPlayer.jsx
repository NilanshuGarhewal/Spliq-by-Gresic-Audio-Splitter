import React, { useState, useEffect, useRef } from "react";
import { PlayIcon, StopIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import "./StemPlayer.scss";

const StemPlayer = ({ stem }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.pause();
    else a.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const update = () => setTime(a.currentTime);
    const meta = () => setDuration(a.duration || 0);
    const end = () => setIsPlaying(false);

    a.addEventListener("timeupdate", update);
    a.addEventListener("loadedmetadata", meta);
    a.addEventListener("ended", end);

    return () => {
      a.removeEventListener("timeupdate", update);
      a.removeEventListener("loadedmetadata", meta);
      a.removeEventListener("ended", end);
    };
  }, [stem.url]);

  const progress = duration ? (time / duration) * 100 : 0;

  const seek = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const t = (x / rect.width) * duration;
    audioRef.current.currentTime = t;
    setTime(t);
  };

  const fmt = (t) => {
    if (isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="stem-container">
      <span className="stem-name">{stem.name}</span>

      <span className="stem-audio">
        <span className="toggle-btn button-square" onClick={toggle}>
          {isPlaying ? <StopIcon size={20} weight="fill"/> : <PlayIcon size={20} weight="fill"/>}
        </span>

        <div className="audio" ref={progressBarRef} onClick={seek}>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <span className="duration">
          {fmt(time)} / {fmt(duration)}
        </span>

        <a href={stem.url} download={stem.name}>
          <span className="button-square">
            <DownloadSimpleIcon weight="bold" size={20} />
          </span>
        </a>
      </span>
      <audio ref={audioRef} src={stem.url}></audio>
    </div>
  );
};

export default StemPlayer;
