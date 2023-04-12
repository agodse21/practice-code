import React from "react";
import "../../App.css";
import BiltyStatementForm from "../BiltyStatementForm";

function BiltyStatement({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("biltystatement")){
    return;}
  return (
    <div className="page-inward">
      <BiltyStatementForm sessionObject={sessionObject} />
    </div>
  );
}

export default BiltyStatement;
