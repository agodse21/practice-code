import { FaTelegramPlane } from "react-icons/fa";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const WelComePage = () => {
  const navigate = useNavigate();
  const Telegram_url = "https://telegram.me/AmolTetrisBot";
  const HandleTeleBtn = () => {
    window.open(Telegram_url);
  };
  return (
    <Box
      w="50%"
      m="auto"
      p={10}
      borderRadius={25}
      mt={"100"}
      h={"-moz-max-content"}
      boxShadow={"dark-lg"}
    >
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Heading size={"xl"}>Welcome to FlameCloud's Trello Board!</Heading>
      </Flex>
      {/* <Flex mt="50" justifyContent={"center"} alignItems={"center"}>
        <VStack spacing={30}>
        
        </VStack>
      </Flex> */}
      <Flex
        w="50%"
        alignItems={"center"}
        p={5}
        m="auto"
        mt={"50"}
        borderRadius={40}
        color={"white"}
        bgColor="blue.500"
        onClick={HandleTeleBtn}
        justifyContent={"center"}
        gap={3}
        fontSize={20}
        cursor="pointer"
      >
        <FaTelegramPlane size={35} /> Log in with Telegram
      </Flex>
    </Box>
  );
};
