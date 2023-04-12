import React from 'react';
import '../../App.css';
import StockInward from '../StockInward';

function StockInwardPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("stock-inward")){
    return;}

  return (
    <div className="page-challan">
      <StockInward sessionObject={sessionObject}/>
    </div>
  );

}

export default StockInwardPage;