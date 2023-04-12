import React from 'react';
import '../../App.css';
import GeneralRateMasterForm from '../GeneralRateMaster';

function GeneralRateMaster({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("general_rate_master")){
    return;}
  return (
    <div className="page-mr">
      <GeneralRateMasterForm sessionObject={sessionObject}/>
    </div>
  );
}

export default GeneralRateMaster;