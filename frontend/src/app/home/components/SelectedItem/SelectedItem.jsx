import React from "react";
import { PlayIcon, StopIcon } from "@phosphor-icons/react";
import "./SelectedItem.scss";
import Loader from "../../../../Library/Loader/Loader";

const SelectedItem = ({
  file,
  togglePlayPause,
  isPlaying,
  progress,
  progressBarRef,
  handleSeek,
  currentTime,
  duration,
  formatTime,
  handleReset,
  handleUpload,
  loading,
  audioRef,
  audioURL,
}) => {
  return (
    <div className="input-box-selected">
      <div className="selected-item">
        <div className="item-info">
          <span>{file.name}</span>
        </div>

        <div className="item-audio">
          <span className="toggle-btn button-square" onClick={togglePlayPause}>
            {isPlaying ? (
              <StopIcon weight="fill" size={20} />
            ) : (
              <PlayIcon weight="fill" size={20} />
            )}
          </span>

          <div className="selected-audio">
            <div
              className="progress-bar"
              ref={progressBarRef}
              onClick={handleSeek}
            >
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <span className="duration">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="input-control">
        <div className="reset-btn button-dark" onClick={handleReset}>
          Reset
        </div>
        <div
          className="upload-btn button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <Loader /> : "Split"}
        </div>
      </div>

      {/* Audio element */}
      <audio ref={audioRef} src={audioURL}></audio>
    </div>
  );
};

export default SelectedItem;
