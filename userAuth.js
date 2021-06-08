const router = require("express").Router();
const { MongoClient, ObjectID } = require("mongodb");
const bcrypt = require("bcrypt");
const auth = require("./emailer");

const dbURL = process.env.DBURL || "mongodb://localhost:27017";

router.post("/register", async (req, res) => {
  try {
    const client = await MongoClient.connect(dbURL, {
      useUnifiedTopology: true,
    });
    const db = client.db("users");
    const userData = await db
      .collection("username")
      .findOne({ email: req.body.email });
    if (!userData) {
      const salt = await bcrypt.genSalt(10);
      const hash = bcrypt.hash(req.body.password, salt, (err, res) => {
        if (err) throw err;
        else return res;
      });
      req.body.password = hash;
      await db.collection("username").insertOne(req.body);
    } else {
      res.status(404).json({
        message: "User already registered",
      });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/login", async (req, res) => {
  try {
    const client = await MongoClient.connect(dbURL, {
      useUnifiedTopology: true,
    });
    const db = client.db("users");
    const userData = await db
      .collection("username")
      .findOne({ email: req.body.email });
    if (userData) {
      const isValid = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (isValid) {
        res.status(200).json({
          message: "Login success",
        });
      } else {
        res.status(401).json({
          message: "Invalid credentials",
        });
      }
    } else {
      res.status(404).json({
        message: "User not registered",
      });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const client = await MongoClient.connect(dbURL, {
      useUnifiedTopology: true,
    });
    const db = client.db("users");
    const userData = await db
      .collection("username")
      .findOne({ email: req.body.email });
    if (userData) {
      const authString = auth(req.body.email);
      await db
        .collection("username")
        .findOneAndUpdate(
          { email: req.body.email },
          { $set: { randomString: authString } }
        );
      res.status(200).json({
        message: "Valid username",
      });
    } else {
      res.status(404).json({
        message: "User not registered",
      });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/resetpassword", async (req, res) => {
  try {
    const client = await MongoClient.connect(dbURL, {
      useUnifiedTopology: true,
    });
    const db = client.db("users");
    const userData = await db.collection("username").findOne({
      $and: [
        { $or: [{ email: req.body.email }] },
        { $or: [{ randomString: req.body.randomString }] },
      ],
    });
    if (userData) {
      await db
        .collection("username")
        .findOneAndUpdate(
          { email: req.body.email },
          { $set: { password: req.body.password } }
        );
      res.status(200).json({
        message: "Password updated",
      });
    } else {
      res.status(404).json({
        message: "Password not updated",
      });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
