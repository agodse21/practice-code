import React, { useEffect, useState } from 'react'
import { TodoInput } from './TodoInput'
import { TodoList } from './TodoList';
import axios from "axios"
import { Header } from './Header';
import {Box} from "@chakra-ui/react"
export interface ITodoProps{
    title:string,
    status:boolean,
    id:number

}
export const Todo = () => {
    const [todo,setTodo]=useState<ITodoProps[]>([]);
    const HandleAddTodo=(title:string)=>{
        const payload={
            title,
            status:false
        }
        axios.post('http://localhost:8080/todos',payload).then(getTodos)
    }

const HandleToggle=(id:number,status:boolean)=>{

    axios.patch(`http://localhost:8080/todos/${id}`,{status}).then(getTodos)
}
const HandleDelete=(id:number)=>{

    axios.delete(`http://localhost:8080/todos/${id}`).then(getTodos)
}

    const getTodos=()=>{
        axios.get('http://localhost:8080/todos')  .then(({data}:{data:ITodoProps[]})=>{
            setTodo(data);
        })
    }
    useEffect(()=>{
getTodos()
    },[])
  return (
    <Box w="50%"  m="auto" mt={5} p={10} border="3px solid red" borderRadius="10px">
        <Header label='Todos' />
       
        <TodoInput HandleAddTodo={HandleAddTodo} />
        {
            todo.length>0&&todo.map(item=>{
                return <TodoList {...item} key={item.id} HandleToggle={HandleToggle} HandleDelete={HandleDelete}/>
            })
        }
    </Box>
  )
}
