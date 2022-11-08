const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
require("dotenv").config();
const colors = require("colors");
const jwt = require("jsonwebtoken");
const { json } = require("express");

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

//=========================DB Collections=============================
// const db = client.db("carDoctor"); // Database Name
// const servicesCollection = db.collection("services"); // Collection Name
const serviceCollection = client.db("himuKitchen").collection("services");
const reviewCollection = client.db("himuKitchen").collection("review");

// ======================= MongoDB Connection =======================

// ======================= JWT Token =======================

//========================= verify token =============================

function verifyTokenJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized access",
    });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "unauthorized access",
      });
    }
    req.decoded = decoded;
    next();
  });
}

// ======================= JWT Token =======================

// ======================= Middleware ===============================

app.post("/jwt", (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.MAIN_JWT_SECRIPT_KEY);

    res.send({
      success: true,
      message: "Successfully got the data from jwt",
      token,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// ======================= Middleware ===============================

// ======================= Routes ===================================
app.get("/", (req, res) => {
  res.send("Hey Hemu Kitchen Server is running now we are cooking food");
});

// get all services
app.get("/services", async (req, res) => {
  try {
    const cursor = serviceCollection.find({}).limit(3);
    const services = await cursor.toArray();
    res.send({
      success: true,
      message: "Successfully got the data",
      data: services,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// ======================= Routes ===================================

//===========================listen to port===========================
app.listen(port, () => {
  console.log(`Server Is Running On ${port} port`);
});
