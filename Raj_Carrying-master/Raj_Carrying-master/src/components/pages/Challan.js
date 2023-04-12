import React from 'react';
import '../../App.css';
import ChallanForm from '../ChallanForm'

function Challan({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("challan")){
    return;}
  return (
    <div className="page-challan">
      <ChallanForm sessionObject={sessionObject}/>
    </div>
  );
}

export default Challan;