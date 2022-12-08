import { Box, Button, Flex } from "@chakra-ui/react";
import React from "react";
import { Navbar } from "../Components/Navbar";
import { Age13To18 } from "./Age13To18";

export const Reports = () => {
  return (
    <>
      <Navbar />
      <Box mt={5}>
        <Flex justifyContent="space-around">
          <Age13To18 />
          {/* <Button onClick={handleAge13to18}>Age B/W 13 to 18</Button> */}
          <Button>Age B/W 18 to 25</Button>
          <Button>Age 25+</Button>
        </Flex>
      </Box>
    </>
  );
};
