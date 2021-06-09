const dotenv = require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");

const userAuth = require("./routes/userAuth");

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", userAuth);

app.listen(port);
