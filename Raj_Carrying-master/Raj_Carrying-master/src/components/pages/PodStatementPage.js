import React from 'react';
import '../../App.css';
import PodStatementForm from '../PodStatementForm';

function PodStatementPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("pod_statement")){
    return;}
  return (
    <div className="page-mr">
      <PodStatementForm sessionObject={sessionObject}/>
    </div>
  );
}

export default PodStatementPage;