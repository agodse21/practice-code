import React from 'react';
import '../../App.css';
import FleetManagement from '../FleetManagement';

function FleetManagementPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("fleet-management")){
    return;}

  return (
    <div className="page-challan">
      <FleetManagement sessionObject={sessionObject}/>
    </div>
  );

}

export default FleetManagementPage;