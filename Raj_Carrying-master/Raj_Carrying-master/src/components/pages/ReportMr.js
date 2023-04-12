import React from "react";
import MrReport from "../MrReport";

export default function ReportMr({ sessionObject }) {
  if (!sessionObject.sessionVariables["modules"].includes("report-bilty")) {
    return;
  }
  return (
    <div className="page-bilty">
      <MrReport sessionObject={sessionObject} />
    </div>
  );
}
