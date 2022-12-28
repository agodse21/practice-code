const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  const data = fs.readFileSync("./db.json", "utf-8");
  let parsed_data = JSON.parse(data);
  res.send(parsed_data.student);
});
app.post("/post", (req, res) => {
  const data = fs.readFileSync("./db.json", "utf-8");
  let parsed_data = JSON.parse(data);
  parsed_data.student.push(req.body);
  fs.writeFileSync("./db.json", JSON.stringify(parsed_data), "utf-8");
  res.send(parsed_data);
});
app.listen(8000, () => {
  console.log("Listing on port 8000");
});
