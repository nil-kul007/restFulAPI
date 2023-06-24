const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
const fileUpload = require("express-fileupload");


// const studentRoute = require("./api/routes/students");
// const teacherRoute = require("./api/routes/teacher");
const userRoute = require("./api/routes/user");
const clientRoute = require('./api/routes/clients')

const app = express();
// mongoose.connect(process.env.URI);
// mongoose.connect('mongodb+srv://nilkul:CMdHYrKen5mYTnnd@cluster0.ebp2n.mongodb.net/?retryWrites=true&w=majority');
mongoose.connect('mongodb://localhost/college_mgt_system');
mongoose.connection.on("error", (err) => {
  console.log("Mongo DB connection error: ", err);
});
mongoose.connection.on("connected", () => {
  console.log("Mongo DB connection successfully ");
});

app.use(fileUpload({
  useTempFiles: true
}))
// logging in the terminal about requested API
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

// app.use("/student", studentRoute);
// app.use("/teacher", teacherRoute);
app.use("/clients", clientRoute);
app.use("/", userRoute);

app.use((req, res, next) => {
  const error = new Error("Not Found...");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      code:'0000',
      message: error.message,
    },
  });
});

module.exports = app;
