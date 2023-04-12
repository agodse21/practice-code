import React from "react";
import "../../App.css";
import GroupMaster from "../GroupMaster";

function GroupMasterPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("group_master")){
    return;}
  return (
    <div className="page-vehicle">
      <GroupMaster sessionObject={sessionObject} />
    </div>
  );
}

export default GroupMasterPage;
