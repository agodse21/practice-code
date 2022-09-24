import React from 'react';
import {Box,Button,Flex, Heading} from "@chakra-ui/react"
interface ITodoProps{
  title:string,
  status:boolean,
  id:number,
  HandleToggle:(val:number,val2:boolean)=>void,
  HandleDelete:(val:number)=>void

}

export const TodoList = ({id,title,status,HandleToggle,HandleDelete}:ITodoProps) => {
  const HandleOnclickToggle=()=>{
    HandleToggle(id,!status)
  }
  const HandleOnClickDelete=()=>{
    HandleDelete(id)
  }
  return (
    <Box mt={5} >
      <Flex p="5px 20px" alignItems="center" border="3px solid teal" borderRadius={10} w="90%" m="auto" justifyContent="space-between">
        <span>{`${id}`}</span>
       <Heading size="md" textTransform="capitalize">{title}</Heading> 
        <Button variant="solid" colorScheme="green" onClick={HandleOnclickToggle}>{status ?"true":"false"}</Button>
        <Button variant="solid" colorScheme="red"  onClick={HandleOnClickDelete}>delete</Button>
        </Flex>
    </Box>
  )
}
