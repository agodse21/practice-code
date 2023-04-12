import React from 'react';
import TripReport from '../TripReport';

export default function TripReportPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("report-bilty")){
    return;}
  return (
    <div className="page-bilty">
    <TripReport sessionObject={sessionObject} />
    </div>
  );
}
