const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hey Hemu Kitchen Server is running now we are cooking food");
});

//===========================listen to port===========================
app.listen(process.env || 5000, () => {
  console.log("Server Is Running On Port 5000");
});
