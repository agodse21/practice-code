import React from 'react'
interface IPropsType{
    label?:string;
    // children?:JSX.Element| JSX.Element[];
}
export const Header = ({label='Default Props'}:IPropsType) => {
  return (
    <div>
        <h1>{label}</h1>
        {/* {children} */}
    </div>
  )
}
