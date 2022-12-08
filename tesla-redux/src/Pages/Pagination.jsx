import { Box, Button, Flex } from "@chakra-ui/react";
import React from "react";

export const Pagination = ({ page, setPage, totalPage }) => {
  return (
    <Box>
      <Flex justifyContent="center">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          PREV
        </Button>
        <Button>{page}</Button>
        <Button onClick={() => setPage(page + 1)} disabled={page === totalPage}>
          NEXT
        </Button>
      </Flex>
    </Box>
  );
};
