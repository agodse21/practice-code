import React from "react";
import "../../App.css";
import ManageDashboard from "../ManageDashboard";

function ManageDashboardPage({ sessionObject }) {
    if (!sessionObject.sessionVariables["modules"].includes("manage-dashboard")) {
        return;
    }
    return (
        <div className="page-vehicle">
            <ManageDashboard sessionObject={sessionObject} />
        </div>
    );
}

export default ManageDashboardPage;
