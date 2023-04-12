import React from 'react';
import '../../App.css';
import AccountReportForm from '../AccountReport';

function AccountReport({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("account-report")){
    return;}
  return (
    <div className="page-mr">
      <AccountReportForm sessionObject={sessionObject}/>
    </div>
  );
}

export default AccountReport;