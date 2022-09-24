import React, { useState } from 'react'
import {Box,Spacer,Center, Flex,Input,Button} from "@chakra-ui/react"
interface IpropsType{
  HandleAddTodo:(value:string)=>void
}
export const TodoInput = ({HandleAddTodo}:IpropsType) => {
  const [title,setTitle]=useState<string>('');
  const changeHandler:React.ChangeEventHandler<HTMLInputElement>=(e)=>{
    setTitle(e.target.value)
};
const ClickHandler=()=>{
  if(title!==''){
    HandleAddTodo(title)
  }
}
  return (
    <Box mt={5}>
      <Center  >
      <Flex  justifyContent='center'>
      <Input  onChange={changeHandler} type={"text"} value={title} placeholder="Enter todo task" />
      <Spacer />
      <Button ml={3} variant="solid" colorScheme="teal" onClick={ClickHandler}>Add</Button>
      </Flex>
      </Center>
    </Box>
  )
}
