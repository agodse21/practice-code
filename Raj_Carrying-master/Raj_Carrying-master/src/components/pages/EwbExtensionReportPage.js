import React from 'react';
import '../../App.css';
import EwbExtensionReport from '../EwbExtensionReport';

function EwbExtensionReportPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("ewbextensionreport")){
    return;}
  return (
    <div className="page-mr">
      <EwbExtensionReport sessionObject={sessionObject}/>
    </div>
  );
}

export default EwbExtensionReportPage;