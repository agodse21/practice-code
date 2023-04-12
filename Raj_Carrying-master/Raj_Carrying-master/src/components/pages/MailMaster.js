import React from 'react';
import '../../App.css';
import MailMaster from '../MailMaster';

function MailMasterPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("mail-master")){
    return;}
  return (
    <div className="page-mr">
      <MailMaster sessionObject={sessionObject}/>
    </div>
  );
}

export default MailMasterPage;