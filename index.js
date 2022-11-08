const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
require("dotenv").config();
const colors = require("colors");

app.use(cors());
app.use(express.json());

// ======================= MongoDB Connection =======================
const MONGO_USER = process.env.MONGO_DB_USER;
const MONGO_PASSWORD = process.env.MONGO_DB_PASSWORD;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@himukitchen.taxuk8x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("DB Connected".blue.bold);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
}
dbConnect();

// ======================= MongoDB Connection =======================

// ======================= Middleware ===============================

// ======================= Middleware ===============================

// ======================= Routes ===================================
app.get("/", (req, res) => {
  res.send("Hey Hemu Kitchen Server is running now we are cooking food");
});

// ======================= Routes ===================================

//===========================listen to port===========================
app.listen(port, () => {
  console.log(`Server Is Running On ${port} port`);
});
