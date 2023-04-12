import React from 'react';
import '../../App.css';
import MrInquiryForm from '../mrInquiry';

function MrInquiryPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("mr-inquiry")){
    return;}
  return (
    <div className="page-mr">
      <MrInquiryForm sessionObject={sessionObject}/>
    </div>
  );
}

export default MrInquiryPage;