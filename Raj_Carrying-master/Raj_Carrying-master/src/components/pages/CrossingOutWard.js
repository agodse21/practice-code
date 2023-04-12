import React from "react";
import "../../App.css";
import CrossingOutwardForm from "../CrossingOutward";

function CrossingOutward({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("crossingOutward")){
    return;}
  return (
    <div className="page-mr">
      <CrossingOutwardForm sessionObject={sessionObject} />
    </div>
  );
}

export default CrossingOutward;
