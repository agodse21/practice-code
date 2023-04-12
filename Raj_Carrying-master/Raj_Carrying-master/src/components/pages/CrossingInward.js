import React from 'react';
import '../../App.css';
import CrossingInwardForm from '../crossingInward';

function CrossingInward({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("crossingInward")){
    return;}
  return (
    <div className="page-mr">
      <CrossingInwardForm sessionObject={sessionObject}/>
    </div>
  );
}

export default CrossingInward;