import React from 'react';
import '../../App.css';
import VehicleRegister from '../VehicleRegister';


function TripPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("trip")){
    return;}
  return (
    <div className="page-challan">
      <VehicleRegister sessionObject={sessionObject}/>
    </div>
  );
}

export default TripPage;