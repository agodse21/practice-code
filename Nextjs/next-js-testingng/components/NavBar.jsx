import React from "react";
import Link from "next/link";
import { Box, Flex, Heading } from "@chakra-ui/react";
export const NavBar = () => {
  return (
    <Flex>
      <Heading>
        <Link href="/">Home </Link>
      </Heading>
      <Link href="/about">
        <Heading>About</Heading>
      </Link>
    </Flex>
  );
};
