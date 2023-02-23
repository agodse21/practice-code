const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  const data = fs.readFileSync("./db.json", { encoding: "utf-8" });
  const parsedData = JSON.parse(data);
  const todos = parsedData.todos;
  console.log(todos);
  res.send(JSON.stringify(todos));
});

app.post("/", (req, res) => {
  const file = fs.readFileSync("./db.json", { encoding: "utf-8" });
  let parsedFile = JSON.parse(file);
  parsedFile.todos.push(req.body);
  console.log(parsedFile);
  parsedFile = JSON.stringify(parsedFile);
  fs.writeFileSync("./db.json", parsedFile, { encoding: "utf-8" });
  res.send("your todo Added!");
});

app.put("/:id", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync("./db.json", { encoding: "utf-8" });
  const parsedData = JSON.parse(data);
  const todos = parsedData.todos;
  console.log(todos);
  todos.map((item) => {
    if (id == item.id) {
      item.title = req.body.title;
      item.status = req.body.status;
    }
    console.log("id dosent exist");
  });
  fs.writeFileSync("./db.json", JSON.stringify(parsedData), {
    encoding: "utf-8",
  });
  res.send(`your todo ${id} is updated successfully `);
});

app.delete("/:id", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync("./db.json", { encoding: "utf-8" });
  const parsedData = JSON.parse(data);
  let todos = parsedData.todos;
  const findData = todos.find((list) => list.id == id);

  if (findData) {
    let todo = todos.filter((item) => item.id !== Number(id));
    parsedData.todos = todo;
    fs.writeFileSync("./db.json", JSON.stringify(parsedData), {
      encoding: "utf-8",
    });
    res.send("deleted");
  } else {
    res.status(404).json({ message: "id dosnent exis" });
  }
});
app.listen(8000, () => {
  console.log("listing on port 8000");
});
