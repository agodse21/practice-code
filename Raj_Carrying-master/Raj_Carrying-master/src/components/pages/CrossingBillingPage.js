import React from 'react';
import '../../App.css';
import CrossingBillingForm from '../CrossingBillingForm';

function CrossingBillingPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("crossingbilling")){
    return;}
  return (
    <div className="page-mr">
      <CrossingBillingForm sessionObject={sessionObject}/>
    </div>
  );
}

export default CrossingBillingPage;