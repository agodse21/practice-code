import React from "react";
import "../../App.css";
import Signup from "../Signup";

function SignupPage({ sessionObject }) {
    if (!sessionObject.sessionVariables["modules"].includes("signup")) {
        return;
    }
    return (
        <div className="page-vehicle">
            <Signup />
        </div>
    );
}

export default SignupPage;
