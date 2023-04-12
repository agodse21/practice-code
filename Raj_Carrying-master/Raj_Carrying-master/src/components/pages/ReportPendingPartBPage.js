import React from 'react';
import PendingPartBReport from '../PendingPartBReport';

export default function ReportPendingPartBPage({ sessionObject }) {
    if (!sessionObject.sessionVariables["modules"].includes("report-pending-partb")) {
        return;
    }
    return (
        <div className="page-bilty">
            <PendingPartBReport sessionObject={sessionObject} />
        </div>
    );
}
