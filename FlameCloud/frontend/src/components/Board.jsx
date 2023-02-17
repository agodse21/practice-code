import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import {
  DeleteTask,
  GetDoingTask,
  GetDoneTask,
  GetPendingTask,
  UpdateTaskStatus,
} from "../Redux/action";

export const Board = ({ data, user_id }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Radiovalue, setRadiovalue] = useState();
  const toast = useToast();
  // console.log(data);
  const HandelDeleteTask = (id) => {
    dispatch(DeleteTask({ user_id: user_id, id: id })).then((res) => {
      if (res == "Task deleted!") {
        toast({
          title: res,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        dispatch(GetPendingTask(user_id));
        dispatch(GetDoingTask(user_id));
        dispatch(GetDoneTask(user_id));
      } else {
        toast({
          title: res,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    });
  };
  const handleUpdate = (id) => {
    const payload = {
      user_id: user_id,
      id: id,
      status: Radiovalue,
    };
    dispatch(UpdateTaskStatus(payload)).then((res) => {
      if (res == "updated successfully!") {
        toast({
          title: res,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        dispatch(GetPendingTask(user_id));
        dispatch(GetDoingTask(user_id));
        dispatch(GetDoneTask(user_id));
        onclose()
      } else {
        toast({
          title: res,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    });
  };
  return (
    <Flex
      w="90%"
      p={2}
      pl={5}
      pr={5}
      justifyContent="space-between"
      alignItems={"center"}
      borderRadius={10}
      border={"1px solid black"}
    >
      <Text cursor={"pointer"} onClick={onOpen} textTransform={"capitalize"}>
        {data.task_title}
      </Text>
      <DeleteIcon
        onClick={() => HandelDeleteTask(data._id)}
        _hover={{ color: "red" }}
        cursor={"pointer"}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Handle Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex alignItems={"center"} gap={2}>
              {" "}
              <Heading size={"sm"}>Task Description:</Heading>
              <Text> {data.task_description}</Text>
            </Flex>
            <Flex mt={3} alignItems={"center"} gap={2}>
              {" "}
              <Heading size={"sm"}>Task Status:</Heading>
              <Text> {data.status}</Text>
            </Flex>
            <Flex mt={3} alignItems={"center"} gap={2}>
              {" "}
              <Heading size={"sm"}>change task status:</Heading>
              <RadioGroup onChange={setRadiovalue} value={Radiovalue}>
                <Stack direction="row">
                  {data.status == "pending" ? (
                    <>
                      <Radio value="doing">doing</Radio>
                      <Radio value="done">done</Radio>
                    </>
                  ) : data.status == "doing" ? (
                    <>
                      <Radio value="pending">pending</Radio>
                      <Radio value="done">done</Radio>
                    </>
                  ) : data.status == "done" ? (
                    <>
                      <Radio value="pending">pending</Radio>
                      <Radio value="doing">doing</Radio>
                    </>
                  ) : (
                    ""
                  )}
                </Stack>
              </RadioGroup>
            </Flex>
            <Button
              mt={2}
              colorScheme={"blue"}
              onClick={() => handleUpdate(data._id)}
            >
              Update Status
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
