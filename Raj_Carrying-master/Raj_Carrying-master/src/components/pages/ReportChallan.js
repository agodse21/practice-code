import React from 'react';
import ChallanReport from '../ChallanReport';

export default function ReportChallan({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("report-challan")){
    return;}
  return (
    <div className="page-challan">
    <ChallanReport sessionObject={sessionObject}/>
    </div>
  );
}
