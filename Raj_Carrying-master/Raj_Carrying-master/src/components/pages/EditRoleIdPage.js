import React from "react";
import "../../App.css";
import EditRoleId from '../EditRoleId'

function EditRoleIdPage({ sessionObject }) {
    if (!sessionObject.sessionVariables["modules"].includes("edit-role-id")) {
        return;
    }
    return (
        <div className="page-vehicle">
            <EditRoleId />
        </div>
    );
}

export default EditRoleIdPage;
