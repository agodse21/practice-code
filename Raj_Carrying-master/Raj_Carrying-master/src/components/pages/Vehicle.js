import React from 'react';
import '../../App.css';
import VehicleForm from '../VehicleForm'

function VehiclePage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("vehicle")){
    return;}
  return (
    <div className="page-vehicle">
      <VehicleForm sessionObject={sessionObject}/>
    </div>
  );
}

export default VehiclePage;