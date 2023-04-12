import React from 'react';
import '../../App.css';
import StockOutward from '../StockOutward';

function StockOutwardPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("stock-outward")){
    return;}

  return (
    <div className="page-challan">
      <StockOutward sessionObject={sessionObject}/>
    </div>
  );

}

export default StockOutwardPage;