import Link from "next/link";
import React from "react";
const data = [
  { id: 1, Name: "Amol" },
  { id: 2, Name: "Amol1" },
  { id: 3, Name: "Amol2" },
];
export default function index() {
  return (
    <div>
      {data.map((item) => (
        <Link href={`products/${item.id}`}>{item.Name}</Link>
      ))}
    </div>
  );
}
