import React from "react";

// COMPONENTS
import Home from "./app/home/Home";
import Navbar from "./layouts/navbar/Navbar";

// STYLESHEETS
import "./sass/_global.scss";
import "./sass/_reset.scss";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Home />
    </div>
  );
};

export default App;
