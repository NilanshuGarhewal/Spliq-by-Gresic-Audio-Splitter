import React from "react";

import "./Header.scss";

const Header = () => {
  return (
    <div className="model-header-container">
      <div className="model-header-heading">
        <span className="title">Audio Splitter</span>
        <span className="des">
          The model used is demucs, if you want to contribute & help in this
          project, you're welcome. <br />
          You can learn more about this project in{" "}
          <a
            href="https://github.com/NilanshuGarhewal/Spliq-by-Gresic-Audio-Splitter"
            className="link"
          >
            GitHub
          </a>
        </span>
      </div>

      <div className="model-header-model-name">
        <div className="model-name">
          <span>Model v1</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
