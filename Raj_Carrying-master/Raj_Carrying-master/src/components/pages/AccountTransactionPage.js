import React from 'react';
import '../../App.css';
import AccountTransaction from '../AccountTransactionForm';

function AccountTransactionPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("challan")){
    return;}
  return (
    <div className="page-challan">
      <AccountTransaction sessionObject={sessionObject}/>
    </div>
  );
}

export default AccountTransactionPage;