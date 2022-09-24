import React from 'react';
import {Heading} from "@chakra-ui/react"
interface IPropsType{
    label?:string;
    // children?:JSX.Element| JSX.Element[];
}

export const Header = ({label}:IPropsType) => {
  return (
   <Heading mt={5}>{label}</Heading>
  )
}
