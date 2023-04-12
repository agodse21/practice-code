import React from "react";
import "../../App.css";
import Hisab from "../Hisab";

function HisabPage({ sessionObject }) {
    if (!sessionObject.sessionVariables["modules"].includes("hisab")) {
        return;
    }
    return (
        <div className="page-vehicle">
            <Hisab sessionObject={sessionObject} />
        </div>
    );
}

export default HisabPage;
