import React, { useEffect, useState } from "react";

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
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../Redux/App/action";

export const Age13To18 = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState([]);
  const [count, setCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.AppReducer.user);

  var count1 = 0;

  const handleAge = () => {
    onOpen();

    let updatedData = users.filter((el) => {
      return el.age > 13 && el.age <= 18;
    });

    // users.map((el) => {
    //   if (el.age > 13 && el.age <= 18) {
    //     if (el.year === "2020") {
    //       count1++;
    //       console.log(count);
    //     }
    //   }
    // });

    setData(updatedData);
  };

  useEffect(() => {
    dispatch(userData());
  }, []);

  console.log(data);

  return (
    <>
      <Button onClick={handleAge}>Age B/W 13 to 18</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Data Age B/W 13 To 18</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Age</Th>
                  <Th>State</Th>
                  <Th>Year</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((item) => {
                  return (
                    <Tr key={item.id}>
                      <Td>{item.name}</Td>
                      <Td>{item.age}</Td>
                      <Td>{item.state}</Td>
                      <Td>{item.year}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            <Table>
              <Thead>
                <Tr>
                  <Th>Year</Th>
                  <Th>No. Of Users</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>2020</Td>
                  <Td>{count1}</Td>
                </Tr>
                <Tr>
                  <Td>2021</Td>
                  <Td>5</Td>
                </Tr>
                <Tr>
                  <Td>2022</Td>
                  <Td>5</Td>
                </Tr>
                <Tr>
                  <Td>2023</Td>
                  <Td>5</Td>
                </Tr>
                <Tr>
                  <Td>2024</Td>
                  <Td>5</Td>
                </Tr>
              </Tbody>
            </Table>
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
