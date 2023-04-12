import React from 'react';
import VehicleReport from '../VehicleReport';

export default function ReportVehicle({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("report-vehicle")){
    return;}
  return (
    <div className="page-bilty">
    <VehicleReport sessionObject={sessionObject} />
    </div>
  );
}
