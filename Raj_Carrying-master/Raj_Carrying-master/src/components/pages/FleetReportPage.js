import React from 'react';
import FleetReport from '../FleetReport';

export default function FleetReportPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("report-fleet")){
    return;}
  return (
    <div className="page-bilty">
    <FleetReport sessionObject={sessionObject} />
    </div>
  );
}
