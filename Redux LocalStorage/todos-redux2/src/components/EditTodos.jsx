import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getTodoFailure, getTodoRequest, getTodoSuccess } from "../Redux/AppReducer/action";
import axios from "axios"
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Center, CloseButton, Flex, Heading, Input, Spacer, Text, useDisclosure, useToast } from "@chakra-ui/react";


const updateTodos=(id, title) =>{
    return axios.patch(`http://localhost:8080/todos/${id}`, {
      title: title,
    });
  }

function EditTodo(){
  
    const [title,setTitle]=useState("");
    const {todos,isError,isLoading}=useSelector((state)=>{
        return{
        todos:state.AppReducer.todos,
        isLoading:state.AppReducer.isLoading,
        isError:state.AppReducer.isError
    }
},shallowEqual);
    const dispatch = useDispatch();
    const { id } = useParams();
console.log(id);

const toast = useToast()

    const handleEdit=(id,title) =>{
        dispatch(getTodoRequest());
        // console.log(id,status)
        updateTodos(id,title).then((r) => {
            dispatch(getTodoSuccess(r.data));
          console.log(r)
          toast({
            title: 'Title Edit successfully.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
           

        }).catch((e)=>{
            dispatch(getTodoFailure());
        })
      }
      
    console.log(title)
    return(<>
        <Box w="40%">
        <Center>
    <Heading mt={5} mb={5} size="md" >Edit Todo</Heading>
    </Center>
          
          <Flex w="100%">
            <Input w="70%" name="title" placeholder="enter title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
           <Spacer />
           
           
            <Button colorScheme="green" w="25%"  onClick={()=>handleEdit(todos.id,title)}>Edit Title
           {/* onOpen(); */}
           </Button>
            </Flex>
            <Box><Text mt={5} ml={3} color="red"> Last Updates: {todos.title}</Text>
            <Center><Link to="/"> <Button mt={5} colorScheme='teal' variant='outline'>Go Home</Button></Link></Center>
     
            </Box> 
        </Box>
       
        </>
    )
}

export default EditTodo;