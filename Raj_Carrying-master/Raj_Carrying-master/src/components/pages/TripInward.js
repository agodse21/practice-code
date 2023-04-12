import React from 'react';
import '../../App.css';
import TripInwardForm from '../TripInward';

function TripInward({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("tripInward")){
    return;}
  return (
    <div className="page-mr">
      <TripInwardForm sessionObject={sessionObject}/>
    </div>
  );
}

export default TripInward;