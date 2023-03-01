const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connection } = require("./config/db");

const PORT = process.env.PORT || 5000;

/* CONFIGURATIONS */
const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected Succesfull to db");
  } catch (err) {
    console.log("error from db");
    console.log(err);
  }
  console.log(`listing on port ${PORT}`);
});
