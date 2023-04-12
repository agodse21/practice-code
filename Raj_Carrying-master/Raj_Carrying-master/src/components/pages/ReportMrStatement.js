import React from "react";
import MrStatementReport from "../MrStatementReport";

export default function ReportMrStatement({ sessionObject }) {
  if (!sessionObject.sessionVariables["modules"].includes("report-mr-statement")) {
    return;
  }
  return (
    <div className="page-bilty">
      <MrStatementReport sessionObject={sessionObject} />
    </div>
  );
}
