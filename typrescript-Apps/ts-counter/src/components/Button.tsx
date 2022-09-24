import React from 'react'
interface ILabelType{
    label:string,
    HandleClick:()=>void
}
export const Button = ({label,HandleClick}:ILabelType) => {
   
  return (
    <button style={{border:"none",padding:"10px 20px",backgroundColor:"teal",color:"white",borderRadius:"5px"}} onClick={HandleClick}>{label}</button>
  )
}
