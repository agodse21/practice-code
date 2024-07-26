import React from "react";
import { useNavigate } from "react-router-dom";
import { useTrackedState } from "../Reducer/store";

export const Home = () => {
  const navigate = useNavigate();
  const state = useTrackedState();

  if (!state.isAuth) {
    navigate("/login");
  }
   
  return <div>Home</div>;
};
