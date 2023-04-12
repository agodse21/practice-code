import React from 'react';
import '../../App.css';
import BankClearance from '../BankClearanceComponent';


function BankClearancePage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("trip")){
    return;}
  return (
    <div className="page-challan">
      <BankClearance sessionObject={sessionObject}/>
    </div>
  );
}

export default BankClearancePage;