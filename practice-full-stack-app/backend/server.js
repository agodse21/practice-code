const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 9000;



app.use(cors());
app.use(express.json());
app.use("/", (req, res) => {
  res.send("Home");
});


app.listen(port, async () => {
  try {
    console.log(`listing on port ${port}`);
  } catch (err) {
    console.log("error form connection");
    console.log(err);
  }
});
