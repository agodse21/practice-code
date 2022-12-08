import { Button } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <Link to="/user">
        <Button>User Section</Button>
      </Link>
      <Link to="/tesla">
        <Button>Tesla Section</Button>
      </Link>
    </div>
  );
};
