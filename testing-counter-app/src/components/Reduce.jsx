import React from 'react'

export const Reduce = ({children,onClick}) => {
  return (
    <button
    data-testid="ReduceBtn"
    onClick={onClick} 
    >{children}</button>
  )
}


