import React from 'react';
import BiltyReport from '../BiltyReport';

export default function ReportBilty({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("report-bilty")){
    return;}
  return (
    <div className="page-bilty">
    <BiltyReport sessionObject={sessionObject} />
    </div>
  );
}
