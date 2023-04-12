import React from "react";
import PodStatementReport from "../PodStatementReport";

export default function ReportPodStatement({ sessionObject }) {
  if (!sessionObject.sessionVariables["modules"].includes("report-pod-statement")) {
    return;
  }
  return (
    <div className="page-bilty">
      <PodStatementReport sessionObject={sessionObject} />
    </div>
  );
}
