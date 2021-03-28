import React, { useEffect, useState } from "react";
import Navigator from "../../components/Navigator/Navigator";
import "./Home.css";
import { Typography } from "antd";
import Sections from "../Sections/Sections";
import Edit from "../Edit/Edit";

const { Title } = Typography;

function Home() {
  return (
    <div className="home">
      {/* <Navigator /> */}
      <div className="content">
        <Sections />
        {/* <Edit /> */}
      </div>
    </div>
  );
}

export default Home;
