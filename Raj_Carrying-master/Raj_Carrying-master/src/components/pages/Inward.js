import React from 'react';
import '../../App.css';
import ChallanInwardForm from '../ChallanInwardForm'

function Inward({ sessionObject }) {
  return (
    <div className="page-inward">
      <ChallanInwardForm sessionObject={sessionObject}/>
    </div>
  );
}

export default Inward;