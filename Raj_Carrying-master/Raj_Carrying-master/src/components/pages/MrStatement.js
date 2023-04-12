import React from "react";
import "../../App.css";
import MrStatementForm from "../MrStatementForm";

function MrStatement({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("mrstatement")){
    return;}
  return (
    <div className="page-inward">
      <MrStatementForm sessionObject={sessionObject} />
    </div>
  );
}

export default MrStatement;
