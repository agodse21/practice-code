import React from 'react';
import '../../App.css';
import AccountReportForm from '../ProfitLossReport';

function ProfitLossReport({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("account-report")){
    return;}
  return (
    <div className="page-mr">
      <AccountReportForm sessionObject={sessionObject}/>
    </div>
  );
}

export default ProfitLossReport;