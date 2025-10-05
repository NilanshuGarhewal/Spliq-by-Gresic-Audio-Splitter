import React from "react";
import { MoonLoader } from "react-spinners";

import "./Loader.scss";

const Loader = () => {
  return (
    <div className="loader">
      <MoonLoader size={16}/>
    </div>
  );
};

export default Loader;
