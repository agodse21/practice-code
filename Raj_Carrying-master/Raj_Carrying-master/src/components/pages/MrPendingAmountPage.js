import React from 'react';
import '../../App.css';
import MrPendingAmount from '../MrPendingAmount';


function MrPendingAmountPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("mr-pending-amount")){
    return;}
  return (
    <div className="page-challan">
      <MrPendingAmount sessionObject={sessionObject}/>
    </div>
  );
}

export default MrPendingAmountPage;