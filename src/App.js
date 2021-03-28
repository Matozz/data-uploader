import React, { useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import Routes from "./Routers";

function App() {
  useEffect(() => {
    // Get Environment
    var userAgent = navigator.userAgent.toLowerCase();
    var isElectron = userAgent.indexOf("electron/") > -1;
    console.log("isElectron: ", isElectron);
  }, []);

  return (
    <div className="app">
      <Routes />
    </div>
  );
}

export default App;
