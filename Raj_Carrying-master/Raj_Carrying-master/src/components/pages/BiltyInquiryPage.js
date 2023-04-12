import React from 'react';
import '../../App.css';
import BiltyInquiryForm from '../BiltyInquiry';

function BiltyInquiryPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("bilty-inquiry")){
    return;}
  return (
    <div className="page-bilty">
      <BiltyInquiryForm sessionObject={sessionObject} />
    </div>
  );
}

export default BiltyInquiryPage;