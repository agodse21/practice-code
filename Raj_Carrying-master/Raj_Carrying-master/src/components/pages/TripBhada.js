import React from 'react';
import '../../App.css';
import TripBhada from '../TripBhadaForm';

function TripBhadaPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("tripbhada")){
    return;}
  return (
    <div className="page-challan">
      <TripBhada sessionObject={sessionObject}/>
    </div>
  );
}

export default TripBhadaPage;