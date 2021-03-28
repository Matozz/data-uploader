import React from "react";
import Navigator from "../../components/Navigator/Navigator";
import Questions from "../Questions/Questions";
import "./Quiz.css";

function Quiz() {
  return (
    <div className="quiz">
      {/* <Navigator /> */}
      <div className="content">
        <Questions />
        {/* <Edit /> */}
      </div>
    </div>
  );
}

export default Quiz;
