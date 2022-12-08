import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userEdit } from "../Redux/App/action";

export const EditModal = ({ id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();

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
    dispatch(userEdit({ id: id, data: userData })).then((res) => {
      // console.log(res);
      onClose();
    });
  };

  return (
    <>
      <Button onClick={onOpen}>Edit</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
                <Select
                  placeholder="Select Year"
                  name="year"
                  onChange={handleChange}
                >
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
