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

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
const orderCollection = client.db("himuKitchen").collection("orders");

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
app.get("/servicelimit", async (req, res) => {
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

app.get("/services", async (req, res) => {
  const page = parseInt(req.query.page);
  const perPage = parseInt(req.query.perPage);
  const services = await serviceCollection
    .find({})
    .skip(page * perPage)
    .limit(perPage)
    .toArray();
  const count = await serviceCollection.estimatedDocumentCount();
  // const cursor = serviceCollection.find({});
  // const services = await cursor.toArray();
  try {
    res.send({
      success: true,
      message: "Successfully got the data",
      count,
      services,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// get singel service

app.get("/services/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await serviceCollection.findOne(query);

    res.send({
      success: true,
      message: "Successfully got the data",
      data: service,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// add service

app.post("/services", async (req, res) => {
  try {
    const service = req.body;
    const result = await serviceCollection.insertOne(service);
    res.send({
      success: true,
      message: "Successfully added the data",
      data: result,
    });
  } catch {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// delete service by id

app.delete("/services/:id", verifyTokenJwt, async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await serviceCollection.deleteOne(query);
    res.send({
      success: true,
      message: "Successfully deleted the data",
      data: result,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// update service by id
app.patch("/services/:id", verifyTokenJwt, async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = req.body;
    const updateDoc = {
      $set: {
        ...service,
      },
    };
    const result = await serviceCollection.updateOne(query, updateDoc);
    res.send({
      success: true,
      message: "Successfully updated the data",
      data: result,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// add orders===========

app.post("/addOrders", async (req, res) => {
  try {
    const order = req.body;
    const result = await orderCollection.insertOne(order);
    res.send({
      success: true,
      message: "Successfully added the data",
      data: result,
    });
  } catch {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// get all orders=========

app.get("/orders", async (req, res) => {
  try {
    const cursor = orderCollection.find({});
    const orders = await cursor.toArray();
    res.send({
      success: true,
      message: "Successfully got the data",
      data: orders,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// delete order by id

app.delete("/orders/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const query = { _id: ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.send({
      success: true,
      message: "Successfully deleted the data",
      data: result,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// adde review by user ======================

app.post("/reviews", async (req, res) => {
  const review = req.body;
  try {
    const result = await reviewCollection.insertOne(review);
    res.send({
      success: true,
      message: "Successfully review added",
      data: result,
    });
  } catch {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// get all review
app.get("/reviews", async (req, res) => {
  let query = {};
  if (req.query.services) {
    query = { services: req.query.services };
  }
  try {
    // const timestemps = new Date().getTime();
    // const sort = { timestamp: -1 };
    const cursor = reviewCollection.find(query).sort({ _id: -1 });
    const reviews = await cursor.toArray();
    res.send({
      success: true,
      message: "Successfully got the data",
      data: reviews,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// get review by email
app.get("/myreviews", async (req, res) => {
  try {
    const cursor = reviewCollection
      .find({ email: req.query.email })
      .sort({ timestamp: -1 });
    const reviews = await cursor.toArray();
    res.send({
      success: true,
      message: "Successfully got the data",
      data: reviews,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// get singel review
app.get("/reviews/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const review = await reviewCollection.findOne(query);

    res.send({
      success: true,
      message: "Successfully got the data",
      data: review,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// update review by id

app.put("/reviews/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const review = req.body;
    const opction = { upsert: true };
    const updateDoc = {
      $set: {
        rating: review.rating,
        revew: review.revew,
      },
    };
    const result = await reviewCollection.updateOne(query, updateDoc, opction);
    res.send({
      success: true,
      message: "Successfully updated the data",
      data: result,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.patch("/reviews/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const review = req.body;
    const updateDoc = {
      $set: {
        ...review,
      },
    };
    const result = await reviewCollection.updateOne(query, updateDoc);
    res.send({
      success: true,
      message: "Successfully updated the data",
      data: result,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// delete review by id
app.delete("/reviews/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await reviewCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      throw new Error("No data found");
    }

    res.send({
      success: true,
      message: "Successfully deleted the data",
      data: result,
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
