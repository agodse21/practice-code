import React from "react";
import { useNavigate } from "react-router-dom";
import { useTrackedState } from "../Reducer/store";
import "./index.css";

export const Home = () => {
  const navigate = useNavigate();
  const state = useTrackedState();
const isAuth=!state.isAuth
  if (isAuth) {
    navigate({
      to:"/login_page"
    });
  }
   
  return <div>Home</div>;
};
