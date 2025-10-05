import React from "react";

// STYLESHEET
import "./Home.scss";

// ACTUAL SPLITTER
import Splitter from "./components/Splitter/Splitter";

const Home = () => {
  return (
    <div className="home">
      <Splitter />
    </div>
  );
};

export default Home;
