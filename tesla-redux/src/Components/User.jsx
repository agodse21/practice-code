import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { userPost } from "../Redux/App/action";
import { useNavigate } from "react-router-dom";

export const User = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();
  const allData = useSelector((state) => state.AppReducer);

  // console.log(allData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userData);
    dispatch(userPost(userData)).then((res) => {
      navigate("/list");
    });
  };

  return (
    <div
      style={{
        width: "40%",
        margin: "50px auto",
      }}
    >
      <form id="form" onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input type="text" name="name" onChange={handleChange} />

          <FormLabel>Age</FormLabel>
          <Input type="number" name="age" onChange={handleChange} />

          <FormLabel>Select State</FormLabel>
          <Select
            placeholder="Select State"
            name="state"
            onChange={handleChange}
          >
            <option value="delhi">delhi</option>
            <option value="mp">MP</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="bihar">Bihar</option>
            <option value="up">UP</option>
          </Select>

          <FormLabel>Select Year</FormLabel>
          <Select placeholder="Select Year" name="year" onChange={handleChange}>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </Select>
        </FormControl>
        <Button type="submit" id="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};
