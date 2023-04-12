import React from "react";
import "../../App.css";
import StationMasterForm from "../StationMasterForm";

function StationMasterPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("station_master")){
    return;}
  return (
    <div className="page-vehicle">
      <StationMasterForm sessionObject={sessionObject} />
    </div>
  );
}

export default StationMasterPage;
