import { SmallAddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Image,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Board } from "../components/Board";

import {
  AddNewTask,
  GetDoingTask,
  GetDoneTask,
  GetPendingTask,
  GetTask,
} from "../Redux/action";
export const HomePage = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const toast = useToast();
  const initial_Status = {
    pending: "pending",
    doing: "doing",
    done: "done",
  };
  const { id } = useParams();
  const user_id = id;
  // const user_id = 5238578396;
  const loading = useSelector((state) => state.isLoading);
  const pending_task = useSelector((state) => state.pending_task);
  const doing_task = useSelector((state) => state.doing_task);
  const done_task = useSelector((state) => state.done_task);
  useEffect(() => {
    dispatch(GetPendingTask(user_id));
    dispatch(GetDoingTask(user_id));
    dispatch(GetDoneTask(user_id));
  }, []);
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const HandleSubmit = (status) => {
    let payload = { ...data, task_status: status, user_id: user_id };
    dispatch(AddNewTask(payload)).then((res) => {
      toast({
        title: res,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      dispatch(GetPendingTask(user_id));
      dispatch(GetDoingTask(user_id));
      dispatch(GetDoneTask(user_id));
    });
  };

  // console.log(data);
  if (loading) {
    <Flex alignItems={"center"} justifyContent={"center"}>
      <Image mt={20} src="https://i.stack.imgur.com/MnyxU.gif" alt="x" />
    </Flex>;
  }
  return (
    <Box>
      <SimpleGrid w="80%" m="auto" mt={50} columns={3} spacing={10}>
        {pending_task.length > 0 && (
          <VStack
            p={2}
            pb={3}
            h="-webkit-fit-content"
            spacing={5}
            borderRadius={10}
            boxShadow={"dark-lg"}
          >
            <Flex
              justifyContent={"space-between"}
              pl={5}
              pr={5}
              w="100%"
              alignItems={"center"}
            >
              <Heading size={"md"}>Pending</Heading>

              <Popover>
                <PopoverTrigger>
                  <Button h={"30"} colorScheme={"blue"}>
                    +
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Add new task in pending column</PopoverHeader>
                  <PopoverBody>
                    <FormLabel>Enter task title:</FormLabel>
                    <Input
                      onChange={handleOnchange}
                      name="task_title"
                      placeholder="task title"
                    />
                    <FormLabel mt={2}>Enter Task Description:</FormLabel>
                    <Input
                      onChange={handleOnchange}
                      name="task_description"
                      placeholder="task description"
                    />

                    <Button
                      onClick={() => HandleSubmit(initial_Status.pending)}
                      w="100%"
                      colorScheme={"blue"}
                      mt={2}
                    >
                      Add Task
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
            {pending_task?.map((ele) => (
              <>
                <Board data={ele} user_id={user_id} />
              </>
            ))}
          </VStack>
        )}
        {doing_task.length > 0 && (
          <VStack
            p={2}
            pb={3}
            h="-webkit-fit-content"
            spacing={5}
            borderRadius={10}
            boxShadow={"dark-lg"}
          >
            <Flex
              justifyContent={"space-between"}
              pl={5}
              pr={5}
              w="100%"
              alignItems={"center"}
            >
              <Heading size={"md"}>Doing</Heading>

              <Popover>
                <PopoverTrigger>
                  <Button h={"30"} colorScheme={"blue"}>
                    +
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Add new task in pending column</PopoverHeader>
                  <PopoverBody>
                    <FormLabel>Enter task title:</FormLabel>
                    <Input
                      onChange={handleOnchange}
                      name="task_title"
                      placeholder="task title"
                    />
                    <FormLabel mt={2}>Enter Task Description:</FormLabel>
                    <Input
                      onChange={handleOnchange}
                      name="task_description"
                      placeholder="task description"
                    />

                    <Button
                      onClick={() => HandleSubmit(initial_Status.doing)}
                      w="100%"
                      colorScheme={"blue"}
                      mt={2}
                    >
                      Add Task
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
            {doing_task?.map((ele) => (
              <>
                <Board data={ele} user_id={user_id} />
              </>
            ))}
          </VStack>
        )}
        {done_task.length > 0 && (
          <VStack
            p={2}
            pb={3}
            h="-webkit-fit-content"
            spacing={5}
            borderRadius={10}
            boxShadow={"dark-lg"}
          >
            <Flex
              justifyContent={"space-between"}
              pl={5}
              pr={5}
              w="100%"
              alignItems={"center"}
            >
              <Heading size={"md"}>Done</Heading>

              <Popover>
                <PopoverTrigger>
                  <Button h={"30"} colorScheme={"blue"}>
                    +
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Add new task in pending column</PopoverHeader>
                  <PopoverBody>
                    <FormLabel>Enter task title:</FormLabel>
                    <Input
                      onChange={handleOnchange}
                      name="task_title"
                      placeholder="task title"
                    />
                    <FormLabel mt={2}>Enter Task Description:</FormLabel>
                    <Input
                      onChange={handleOnchange}
                      name="task_description"
                      placeholder="task description"
                    />

                    <Button
                      onClick={() => HandleSubmit(initial_Status.done)}
                      w="100%"
                      colorScheme={"blue"}
                      mt={2}
                    >
                      Add Task
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
            {done_task?.map((ele) => (
              <>
                <Board data={ele} user_id={user_id} />
              </>
            ))}
          </VStack>
        )}
      </SimpleGrid>
    </Box>
  );
};
