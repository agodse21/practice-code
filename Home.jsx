import React from "react";
import { useNavigate } from "react-router-dom";
import { useTrackedState } from "../Reducer/store";
import "./app.css";

export const Home = () => {
  const navigate = useNavigate();
  const state = useTrackedState();

  if (!state.isAuth) {
    navigate({
      to:"/login"
    });
  }
   
  return <div>Home</div>;
};
