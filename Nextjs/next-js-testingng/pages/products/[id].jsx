import React from "react";
import { useRouter } from "next/router";
export default function productsDetials() {
  const { id } = useRouter().query;

  return <div>product Details{id}</div>;
}
