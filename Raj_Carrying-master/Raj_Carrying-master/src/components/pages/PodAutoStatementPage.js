import React from 'react';
import '../../App.css';
import PodAutoStatement from '../PodAutoStatement';

function PodAutoStatementPage({ sessionObject }) {
//   if(!sessionObject.sessionVariables["modules"].includes("pod-auto-statement")){
//     return;}
  return (
    <div className="page-mr">
      <PodAutoStatement sessionObject={sessionObject}/>
    </div>
  );
}

export default PodAutoStatementPage;