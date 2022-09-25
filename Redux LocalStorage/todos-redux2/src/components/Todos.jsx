import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getTodoFailure, getTodoRequest, getTodoSuccess, posTodoRequest, postTodoFailure, postTodoSuccess } from "../Redux/AppReducer/action";
import TodosInput from "./TodosInput";
import { Box, Button, Center, Flex, Heading, Spacer, Text, useToast } from "@chakra-ui/react";
import { CloseIcon, Icon } from "@chakra-ui/icons";

const deleteTodoApi=(id)=>{
    return axios.delete(`http://localhost:8080/todos/${id}`)
}
const getTodoApi=(id)=>{
    return axios(`http://localhost:8080/todos/${id}`)
}
function Todos() {
    const dispatch = useDispatch();
    const {todos,isError,isLoading}=useSelector((state)=>{return{
        todos:state.AppReducer.todos,
        isLoading:state.AppReducer.isLoading,
        isError:state.AppReducer.isError
    }
},shallowEqual)


const toast = useToast()
    const getTodos=()=>{
        dispatch(getTodoRequest());
      return  axios.get(`http://localhost:8080/todos`).then((r)=>{
            // console.log("ajna",r.data)
dispatch(getTodoSuccess(r.data));
        }).catch((e)=>{
dispatch(getTodoFailure());
        })
    }


    const addTodo=(title)=>{
        const payload={
            title,
            status:false
        };
        dispatch(posTodoRequest());
        return axios.post(`http://localhost:8080/todos`,payload).then((r)=>{
            dispatch(postTodoSuccess())
        }).catch((err)=>{
            dispatch(postTodoFailure());
        })
    }

const handleAddTodos=(text)=>{
addTodo(text).then(()=>{getTodos()
    toast({
        position: 'bottom-right',
        title: 'Task Added!',
        // description: "We've created your account for you.",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
}

)
}

useEffect(()=>{
    getTodos();
},[])

const getTododsbyApi=(id)=>{
    getTodoApi(id).then((r)=>{
        // console.log(r.data)
        dispatch(getTodoSuccess());
    }).catch((e)=>{
        dispatch(getTodoFailure())
    });
}

// useEffect(()=>{

// },[id])


const handleDeleteTodo=(id)=>{
    dispatch(getTodoRequest());
    deleteTodoApi(id).then((r)=>{
        dispatch(getTodoSuccess(r.data)); 
        toast({
            position: 'bottom-right',
            title: 'Task Deleted!',
            // description: "We've created your account for you.",
            status: 'error',
            duration: 2000,
            isClosable: true,
          })
        getTodos(); 
    }).catch((e)=>{
        dispatch(getTodoFailure())
    });
   
}
// console.log(todos.length)
  return (<Box w="40%">
 
    <TodosInput addTodo={handleAddTodos} />
    <Center>
    <Heading mt={5} mb={5} size="md" >Todo Lists</Heading>
    </Center>
{
    todos.length>0 && todos.map(item=>{return(
       <> 
       <Box key={item.id} mb={4}>
        <Flex alignItems="center" p={4} border="1px solid black">
       <Link  to={`/todo/${item.id}`}>
    <Box  >
      <Heading size="sm">  {item.title}</Heading>
      {/* -{item.status?"true":"false"} */}

    </Box> </Link> <Spacer />  
    <Button onClick={()=>handleDeleteTodo(item.id)} colorScheme='red' variant='solid'>
   <Icon as={CloseIcon}></Icon>
  </Button>
      {/* <button onClick={()=>handleDeleteTodo(item.id)}>delete</button> */}
      </Flex></Box></>)})
  
}
  </Box>
  );
}

export { Todos };
