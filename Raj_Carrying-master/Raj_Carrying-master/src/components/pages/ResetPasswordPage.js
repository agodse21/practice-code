import React from 'react';
import ResetPassword from '../ResetPassword';

export default function ResetPasswordPage({ sessionObject }) {
    if(!sessionObject.sessionVariables["modules"].includes("change-password")){
        return;}
    return (
        <div>
            <ResetPassword sessionObject={sessionObject} />
        </div>
    );
}
