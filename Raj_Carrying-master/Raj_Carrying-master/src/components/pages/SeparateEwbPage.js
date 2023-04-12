import React from 'react';
import SeparateEwb from '../SeparateEwb';

export default function SeparateEwbPage({ sessionObject }) {
    if(!sessionObject.sessionVariables["modules"].includes("separate-ewb")) {
        return;
    }

    return (
        <div className='page-challan'>
            <SeparateEwb sessionObject={sessionObject} />
        </div>
    );
}
