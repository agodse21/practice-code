import React from 'react';
import '../../App.css';
import ConsignorBillingForm from '../ConsignorBillingForm';

function ConsignorBilling({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("consignorbilling")){
    return;}
  return (
    <div className="page-mr">
      <ConsignorBillingForm sessionObject={sessionObject}/>
    </div>
  );
}

export default ConsignorBilling;