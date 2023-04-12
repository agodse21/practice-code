import React from 'react';
import '../../App.css';
import AckPendingPartyReport from '../AckPendingPartyReport';

function AckPendingPartyReportPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("ackpendingpartyreport")){
    return;}
  return (
    <div className="page-mr">
      <AckPendingPartyReport sessionObject={sessionObject}/>
    </div>
  );
}

export default AckPendingPartyReportPage;