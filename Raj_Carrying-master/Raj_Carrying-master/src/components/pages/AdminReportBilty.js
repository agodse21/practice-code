import React from 'react';
import AdminBiltyReport from '../AdminBiltyReport';

export default function AdminReportBilty({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("report-bilty")){
    return;}
  return (
    <div className="page-bilty">
    <AdminBiltyReport sessionObject={sessionObject} />
    </div>
  );
}
