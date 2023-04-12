import React from "react";
import "../../App.css";
import GroupMaster from "../GroupMaster";
import SubgroupMaster from "../SubgroupMaster";

function SubgroupMasterPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("group_master")){
    return;}
  return (
    <div className="page-vehicle">
      <SubgroupMaster sessionObject={sessionObject} />
    </div>
  );
}

export default SubgroupMasterPage;
