import React from "react";
import "../../App.css";
import AccountMasterForm from "../AccountMasterForm";

function AccountMasterPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("account_master")){
    return;}
  return (
    <div className="page-vehicle">
      <AccountMasterForm sessionObject={sessionObject} />
    </div>
  );
}

export default AccountMasterPage;
