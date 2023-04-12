import React from "react";
import "../../App.css";
import PodChallanInwardForm from "../PodChallanInwardForm";

function PodChallanInward({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("pod_challan_inward")){
    return;}
  return (
    <div className="page-inward">
      <PodChallanInwardForm sessionObject={sessionObject} />
    </div>
  );
}

export default PodChallanInward;
