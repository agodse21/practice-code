import React from 'react';
import VehicleRegisterReport from '../VehicleRegisterReport';

export default function ReportBilty({ sessionObject }) {
//   if(!sessionObject.sessionVariables["modules"].includes("report-vehicle")){
//     return;}
  return (
    <div className="page-bilty">
    <VehicleRegisterReport sessionObject={sessionObject} />
    </div>
  );
}
