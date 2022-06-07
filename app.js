const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
require('dotenv').config()

const studentRoute = require("./api/routes/students");
const teacherRoute = require("./api/routes/teacher");

const app = express();
mongoose.connect(process.env.URI);
// console.log(process.env)
// mongoose.connect(
//   "mongodb+srv://nilkul:CMdHYrKen5mYTnnd@cluster0.ebp2n.mongodb.net/?retryWrites=true&w=majority"
// );
mongoose.connection.on("error", (err) => {
  console.log("Mongo DB connection error: ", err);
});
mongoose.connection.on("connected", () => {
  console.log("Mongo DB connection successfully ");
});

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method=== 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({})
    }
    next()
})

app.use("/student", studentRoute);
app.use("/teacher", teacherRoute);

app.use((req, res, next) => {
  res.status(404).json({
    error: "Bad URL Request",
  });
});

module.exports = app;
