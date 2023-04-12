import React from "react";
import PaidStatementReport from "../PaidStatementReport";

export default function ReportPaidStatement({ sessionObject }) {
  if (!sessionObject.sessionVariables["modules"].includes("report-paid-statement")) {
    return;
  }
  return (
    <div className="page-bilty">
      <PaidStatementReport sessionObject={sessionObject} />
    </div>
  );
}
