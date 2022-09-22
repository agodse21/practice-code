import React from 'react';
// import "./Button.css"

export const Add = ({children,onClick}) => {
  return <button
  data-testid="AddBtn"
  onClick={onClick} 
  >{children}</button>
}
