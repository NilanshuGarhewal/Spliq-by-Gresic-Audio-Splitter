import React from "react";
import "./InputBox.scss";

const InputBox = ({handleFileChange, fileInputRef}) => {
  return (
    <div className="input-box">
      <label className="input-text" htmlFor="audio-file-input">
        <span className="title">Add or drop a file</span>
        <span className="des">Click & browse, or drag & drop here</span>
      </label>

      <input
        id="audio-file-input"
        type="file"
        onChange={handleFileChange}
        className="file-input"
        ref={fileInputRef}
        accept="audio/*"
      />
    </div>
  );
};

export default InputBox;
