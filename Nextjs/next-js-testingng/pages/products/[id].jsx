import React, { useEffect } from "react";
import { useRouter } from "next/router";
const URL = "https://jsonplaceholder.typicode.com/users";
export default function productsDetials() {
  const { id } = useRouter().query;
  console.log(id)
  useEffect(() => {
    fetch(`${URL}/${id}`)
      .then((data) => data.json())
      .then((res) => {
        console.log(id,res);
      });
  }, [id]);
  return <div>product Details{id}</div>;
}
