import React from "react";
import MrPendingAmountReport from "../MrPendingAmountReport";

export default function ReportMrPendingAmount({ sessionObject }) {
  if (!sessionObject.sessionVariables["modules"].includes("report-mr-pending-amount")) {
    return;
  }
  return (
    <div className="page-bilty">
      <MrPendingAmountReport sessionObject={sessionObject} />
    </div>
  );
}
