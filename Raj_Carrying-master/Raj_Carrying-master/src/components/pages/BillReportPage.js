import React from 'react';
import BillReport from '../BillReport';

export default function BillReportPage({ sessionObject }) {
  // if(!sessionObject.sessionVariables["modules"].includes("report-bill")){
  //   return;}
  return (
    <div className="page-bilty">
    <BillReport sessionObject={sessionObject} />
    </div>
  );
}
