import React from "react";
import UserReport from "../UserReport";

export default function ReportUser({ sessionObject }) {
  if (!sessionObject.sessionVariables["modules"].includes("report-user")) {
    return;
  }
  return (
    <div className="page-bilty">
      <UserReport sessionObject={sessionObject} />
    </div>
  );
}
