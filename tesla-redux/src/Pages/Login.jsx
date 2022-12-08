import React, { useContext, useState } from "react";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { loginData } from "../Redux/Auth/action";
import { USER_LOGIN_SUCCESS } from ".././Redux/Auth/actionType";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export const Login = () => {
  const [userData, setUserData] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const comingFrom = location.state?.data || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginData(userData))
      .then((res) => {
        if (res.type === USER_LOGIN_SUCCESS) {
          alert("Login successful");
          navigate(comingFrom, { replace: true });
        }
      })
      .catch((err) => {
        alert("Login failed");
      });
  };

  return (
    <div
      style={{
        width: "30%",
        border: "1px solid red",
        margin: "100px auto",
        padding: "20px",
      }}
    >
      <form id="form" onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Enter Email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Enter Password"
          />
        </FormControl>
        <Button w="full" type="submit" colorScheme="blue" mt={2}>
          Login
        </Button>
      </form>
    </div>
  );
};
