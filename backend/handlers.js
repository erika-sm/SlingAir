"use strict";
const assert = require("assert");
const { MongoClient } = require("mongodb");

require("dotenv").config();

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

const {
  MONGO_URI_FLIGHTS,
  MONGO_URI_RESERVATIONS,
  MONGO_URI_USERS,
  USERNAME,
  PASSWORD,
} = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getFlights = async (req, res) => {
  const access = req.params.access;
  const client = new MongoClient(MONGO_URI_FLIGHTS, options);

  let accessType;

  if (access === "admin") {
    accessType = "AdminFlights";
  } else if (access === "general") {
    accessType = "flightNumbers";
  } else {
    res.status(400).json({ status: 400, message: "Invalid access type" });
  }

  await client.connect();

  const db = client.db("Flights");
  const result = await db.collection(`${accessType}`).find().toArray();

  if (result.length > 0) {
    return res.status(200).json({
      status: 200,
      data: result,
      message: `Successfully retrieved list of flights!`,
    });
  } else {
    return res.status(404).json({
      status: 404,
      message: `Unable to retrieve list of flights.`,
    });
  }
};

const getFlight = async (req, res) => {
  const flight = req.params.flight;

  const client = new MongoClient(MONGO_URI_FLIGHTS, options);

  await client.connect();

  const db = client.db("Flights");
  const result = await db.collection(`${flight}`).find().toArray();

  if (result.length > 0) {
    return res.status(200).json({
      status: 200,
      data: result,
      message: `Successfully retrieved Flight ${flight} data!`,
    });
  } else {
    return res.status(404).json({
      status: 404,
      data: result,
      message: `Flight ${flight} does not exist`,
    });
  }
};

const addReservations = async (req, res) => {
  const resDetails = req.body;

  const resData = {
    _id: uuidv4(),
    flight: resDetails.flightNum,
    seat: resDetails.seat,
    givenName: resDetails.firstName,
    surname: resDetails.lastName,
    email: resDetails.email,
  };

  const userData = {
    _id: resDetails.email,
    givenName: resDetails.firstName,
    surname: resDetails.lastName,
    reservations: [resData._id],
  };

  const query = { _id: resDetails.seat };
  const updatedValues = {
    $set: { isAvailable: false },
  };
  const flightsClient = new MongoClient(MONGO_URI_FLIGHTS, options);
  const reservationsClient = new MongoClient(MONGO_URI_RESERVATIONS, options);
  const userClient = new MongoClient(MONGO_URI_USERS, options);

  await flightsClient.connect();

  await reservationsClient.connect();

  await userClient.connect();

  const flightsDB = flightsClient.db("Flights");
  const reservationsDB = reservationsClient.db("Reservations");
  const userDB = userClient.db("Users");

  const user = await userDB.collection("Data").findOne({ _id: resData.email });

  if (
    user &&
    (user.surname !== resData.surname || user.givenName !== resData.givenName)
  ) {
    return res.status(404).json({
      status: 404,
      data: user.surname + " " + user.givenName,
      message:
        "Name does not match data associated with this email address. Please try again.",
    });
  }

  const updateSeats = await flightsDB
    .collection(`${resDetails.flightNum}`)
    .updateOne(query, updatedValues);

  if (updateSeats.modifiedCount === 1) {
    if (!user) {
      await userDB.collection("Data").insertOne(userData);
    } else {
      await userDB
        .collection("Data")
        .updateOne(
          { _id: resData.email },
          { $push: { reservations: resData._id } }
        );
    }

    await reservationsDB.collection("Data").insertOne(resData);
    return res.status(200).json({
      status: 200,
      data: resData,
      message: "Reservsation successfully confirmed!",
    });
  } else
    return res.status(400).json({
      status: 400,
      data: resDetails.seat,
      message: "Seat is no longer available.",
    });
};

const getReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RESERVATIONS, options);

  await client.connect();

  const db = client.db("Reservations");
  const result = await db.collection("Data").find().toArray();

  if (result.length > 0) {
    return res.status(200).json({
      status: 200,
      data: result,
      message:
        "Successfully retrieved all reservations for Slingshot Airlines!",
    });
  } else {
    return res.status(404).json({
      status: 404,
      message: `Unable to retrieve list of reservations.`,
    });
  }
};

const getSingleReservation = async (req, res) => {
  const _id = req.params._id;
  const client = new MongoClient(MONGO_URI_RESERVATIONS, options);

  await client.connect();

  const db = client.db("Reservations");
  await db.collection("Data").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({
          status: 200,
          data: result,
          message: `Successfully retrieved reservation #${_id}`,
        })
      : res
          .status(404)
          .json({ status: 404, data: _id, message: "Reservation not Found" });
  });
};

const getFilteredReservations = async (req, res) => {
  const filter = req.query;
  const client = new MongoClient(MONGO_URI_RESERVATIONS, options);

  await client.connect();

  const db = client.db("Reservations");
  const result = await db.collection("Data").find(filter).toArray();

  if (result.length > 0) {
    res.status(200).json({
      status: 200,
      data: result,
      message: "Successfully retrieved all reservations",
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "No matching reservations found.",
    });
  }
};

const deleteReservation = async (req, res) => {
  const _id = req.params._id;

  const flightClient = new MongoClient(MONGO_URI_FLIGHTS, options);

  const resClient = new MongoClient(MONGO_URI_RESERVATIONS, options);

  const userClient = new MongoClient(MONGO_URI_USERS, options);

  await flightClient.connect();
  await resClient.connect();
  await userClient.connect();

  const flightDB = flightClient.db("Flights");
  const resDB = resClient.db("Reservations");
  const userDB = userClient.db("Users");

  const reservation = await resDB.collection("Data").findOne({ _id });
  if (reservation) {
    const query = { _id: reservation.seat };
    const updatedValues = {
      $set: { isAvailable: true },
    };

    const userQuery = { _id: reservation.email };

    await flightDB
      .collection(`${reservation.flight}`)
      .updateOne(query, updatedValues);

    const result = await resDB.collection("Data").deleteOne({ _id });

    await userDB
      .collection("Data")
      .updateOne(userQuery, { $pull: { reservations: { $in: [_id] } } });

    return res.status(200).json({
      status: 200,
      data: result,
      message: `Successfully deleted reservation #${_id}`,
    });
  } else {
    return res
      .status(404)
      .json({ status: 404, data: _id, message: "Reservation not found" });
  }
};

const updateReservation = async (req, res) => {
  const _id = req.body._id;
  const seat = req.body.seat;
  const flightNum = req.body.flightNum;
  let prevSeat;

  const resClient = new MongoClient(MONGO_URI_RESERVATIONS, options);
  const flightsClient = new MongoClient(MONGO_URI_FLIGHTS, options);

  await resClient.connect();
  await flightsClient.connect();

  const resDB = resClient.db("Reservations");
  const flightsDB = flightsClient.db("Flights");

  const result = await resDB.collection("Data").findOne({ _id });

  if (result) {
    prevSeat = result.seat;

    const resQuery = { _id: _id };
    const resUpdatedValues = {
      $set: { seat: seat },
    };

    const prevSeatQuery = { _id: prevSeat };
    const prevSeatUpdate = {
      $set: { isAvailable: true },
    };

    const newSeatQuery = { _id: seat };
    const newSeatUpdate = {
      $set: { isAvailable: false },
    };

    await resDB.collection("Data").updateOne(resQuery, resUpdatedValues);

    await flightsDB
      .collection(`${flightNum}`)
      .updateOne(prevSeatQuery, prevSeatUpdate);

    const newSeat = await flightsDB
      .collection(`${flightNum}`)
      .updateOne(newSeatQuery, newSeatUpdate);

    if (newSeat.modifiedCount === 0) {
      return res.status(400).json({
        status: 400,
        data: { previousSeat: prevSeat, newSeat: seat },
        message: "Seat is no longer available",
      });
    }

    return res.status(200).json({
      status: 200,
      data: { previousSeat: prevSeat, newSeat: seat },
      message: "Reservation successfully updated!",
    });
  } else
    return res
      .status(404)
      .json({ status: 404, message: "Reservation not found" });
};

const getUserData = async (req, res) => {
  const _id = req.params._id;

  const client = new MongoClient(MONGO_URI_USERS, options);

  await client.connect();

  const db = client.db("Users");
  const result = await db.collection("Data").findOne({ _id });

  if (result) {
    return res.status(200).json({
      status: 200,
      data: result,
      message: `Successfully retrieved user data!`,
    });
  } else {
    return res.status(404).json({
      status: 404,
      data: result,
      message: "User not found. Please try again.",
    });
  }
};

const updateUserData = async (req, res) => {
  const data = req.body;
  const _id = req.body._id;

  let givenName;
  let surname;

  if (!data._id) {
    return res.status(400).json({
      status: 400,
      message: "Please include a valid _id in your body.",
    });
  }

  if (!data.surname && !data.givenName) {
    return res.status(404).json({
      status: 400,
      message: "No valid parameters in body",
    });
  }

  const usersClient = new MongoClient(MONGO_URI_USERS, options);
  const resClient = new MongoClient(MONGO_URI_RESERVATIONS, options);

  await usersClient.connect();

  await resClient.connect();

  const usersDB = usersClient.db("Users");
  const resDB = resClient.db("Reservations");

  const result = await usersDB.collection("Data").findOne({ _id });

  if (result) {
    if (!data.givenName) {
      givenName = result.givenName;
    } else givenName = data.givenName;
    if (!data.surname) {
      surname = result.surname;
    } else surname = data.surname;

    const userQuery = { _id: data._id };
    const updatedUserValues = {
      $set: {
        givenName: givenName,
        surname: surname,
      },
    };

    const resQuery = { email: data._id };
    const resUpdate = {
      $set: {
        givenName: givenName,
        surname: surname,
      },
    };

    const updateUser = await usersDB
      .collection("Data")
      .updateOne(userQuery, updatedUserValues);

    await resDB.collection("Data").updateMany(resQuery, resUpdate);

    if (updateUser.modifiedCount === 1) {
      res.status(200).json({
        status: 200,
        data: updatedUserValues.$set,
        message: "User data successfully updated",
      });
    } else {
      res.status(400).json({
        status: 404,
        data: updatedUserValues.$set,
        message: "No changes detected.",
      });
    }
  } else {
    res.status(404).json({ status: 404, message: "User not found" });
  }
};

const validateAdmin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username !== USERNAME || password !== PASSWORD) {
    res.status(401).json({ status: 401, message: "Invalid credentials." });
  } else
    res
      .status(200)
      .json({ status: 200, message: "Admin successfully validated" });
};

const updateUserInformation = (module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservations,
  getSingleReservation,
  getFilteredReservations,
  deleteReservation,
  updateReservation,
  getUserData,
  updateUserData,
  validateAdmin,
});
