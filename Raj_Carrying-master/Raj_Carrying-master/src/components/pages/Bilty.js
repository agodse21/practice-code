import React from 'react';
import '../../App.css';
import FormSignup from '../FormSignup'

function Bilty({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("bilty")){
    return;}
    return (
      <div className="page-bilty">
        <FormSignup sessionObject={sessionObject} />
      </div>
    );
}

export default Bilty;