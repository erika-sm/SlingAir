const assert = require("assert");
const { MongoClient } = require("mongodb");
const { flights, reservations } = require("./data");

require("dotenv").config();

const { MONGO_URI_FLIGHTS, MONGO_URI_RESERVATIONS, MONGO_URI_USERS } =
  process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const fixedFlightArr = flights.Oceanic815.map((flight) => {
  flight._id = flight.id;
  delete flight.id;
  return flight;
});

const fixedResArr = reservations.map((res) => {
  res._id = res.id;
  delete res.id;
  return res;
});

const batchImportFlights = async () => {
  try {
    const client = new MongoClient(MONGO_URI_FLIGHTS, options);

    await client.connect();

    const db = client.db("Flights");

    const result = await db.collection("Oceanic815").insertMany(fixedFlightArr);
    assert.equal(fixedFlightArr.length, result.insertedCount);

    console.log("success");
  } catch (err) {
    console.log(err.message);
  }
};

const batchImportReservations = async () => {
  try {
    const client = new MongoClient(MONGO_URI_RESERVATIONS, options);

    await client.connect();

    const db = client.db("Reservations");

    const result = await db.collection("Data").insertMany(fixedResArr);
    assert.equal(fixedResArr.length, result.insertedCount);

    console.log("success");
  } catch (err) {
    console.log(err.message);
  }
};

const batchImportUsers = async () => {
  try {
    const client = new MongoClient(MONGO_URI_USERS, options);

    await client.connect();

    const db = client.db("Users");

    const user = {
      _id: "marty@backfuture.com",
      givenName: "Marty",
      surname: "McFly",
      reservations: ["88a33c23-3332-4ef2-bd71-be7a6430485f"],
    };

    const result = await db.collection("Data").insertOne(user);
    assert.equal(user.length, result.insertedCount);

    console.log("success");
  } catch (err) {
    console.log(err.message);
  }
};

batchImportFlights();
