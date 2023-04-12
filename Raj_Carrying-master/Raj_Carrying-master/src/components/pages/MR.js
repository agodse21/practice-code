import React from 'react';
import '../../App.css';
import MRForm from '../MRForm';

function MR({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("mr")){
    return;}
  return (
    <div className="page-mr">
      <MRForm sessionObject={sessionObject}/>
    </div>
  );
}

export default MR;