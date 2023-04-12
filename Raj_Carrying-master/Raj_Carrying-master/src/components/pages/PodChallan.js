import React from "react";
import "../../App.css";
import PodChallanForm from "../PodChallanForm";

function PodChallan({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("pod_challan")){
    return;}
  return (
    <div className="page-challan">
      <PodChallanForm sessionObject={sessionObject} />
    </div>
  );
}

export default PodChallan;
