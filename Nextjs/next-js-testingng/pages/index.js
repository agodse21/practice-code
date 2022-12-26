// import Head from "next/head";
// import Image from "next/image";
// import { Inter } from "@next/font/google";
// import styles from "../styles/Home.module.css";
import { Button, Heading } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState(0);

  return (
    <>
      <Heading>{data}</Heading>
      <Button onClick={() => setData(data + 1)}>count</Button>
    </>
  );
}
