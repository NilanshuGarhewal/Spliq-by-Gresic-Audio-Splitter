import React from "react";

import "./Header.scss";

const Header = () => {
  return (
    <div className="model-header-container">
      <div className="model-header-heading">
        <span className="title">Audio Splitter</span>
        <span className="des">
          This is the first model of our Spliq audio splitter, it can be inaccurate.
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