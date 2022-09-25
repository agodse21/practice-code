import React from "react";
import { useSelector } from "react-redux";
import {Routes,Route} from "react-router-dom"
import EditTodo from "../components/EditTodos";
import ErrorPage from "../components/ErrorPage";
import LoginPage from "../components/Login";
import SingleTodo from "../components/SingleTodo";
import { Todos } from "../components/Todos";
function AllRouter(){
    const isAuth=useSelector(state=>state.AuthRedcer.isAuth);
    return (
        <Routes>
            {isAuth ===true ?<Route path="/" element={<Todos />} />:<Route path="/" element={<LoginPage />}/>}

<Route path="/todo/:id" element={<SingleTodo />} ></Route>
<Route path="/todo/:id/edit" element={<EditTodo />}></Route>
<Route path="/*" element={<ErrorPage />}></Route>
<Route path="/login" element={<LoginPage />}/>
        </Routes>
    )
}

export default AllRouter;