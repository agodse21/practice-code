import React from 'react';
import '../../App.css';
import Trip from '../Trip';
import ChallanForm from '../Trip'

function TripPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("trip")){
    return;}
  return (
    <div className="page-challan">
      <Trip sessionObject={sessionObject}/>
    </div>
  );
}

export default TripPage;