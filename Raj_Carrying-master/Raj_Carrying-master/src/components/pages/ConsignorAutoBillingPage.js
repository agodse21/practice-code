import React from 'react';
import '../../App.css';
import ConsignorAutoBillingForm from '../ConsignorAutoBillingForm';

function ConsignorAutoBillingPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("consignor-auto-billing")){
    return;}
  return (
    <div className="page-mr">
      <ConsignorAutoBillingForm sessionObject={sessionObject}/>
    </div>
  );
}

export default ConsignorAutoBillingPage;