import React from 'react';
import '../../App.css';
import PartyRateMasterForm from '../PartyRateMaster';

function PartyRateMaster({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("party_rate_master")){
    return;}
  return (
    <div className="page-mr">
      <PartyRateMasterForm sessionObject={sessionObject}/>
    </div>
  );
}

export default PartyRateMaster;