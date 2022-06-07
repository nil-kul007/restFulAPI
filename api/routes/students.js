const express = require("express");
const { json } = require("express/lib/response");
const mongoose = require("mongoose");
const Student = require("../module/studentModule");

const router = express.Router();

router.get("/", (req, res, next) => {
  Student.find()
    .select("_id name classNo rollNo")
    .exec()
    .then((result) => {
      res.status(200).json({
        count: result.length,
        students: result,
      });
    })
    .catch((err) => {
      res.status(404).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const student = new Student({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    gender: req.body.gender,
    rollNo: req.body.rollNo,
    contact: req.body.contact,
    email: req.body.email,
    address: req.body.address,
    classNo: req.body.classNo,
  });

  Student.find({ rollNo: req.body.rollNo, classNo: req.body.classNo })
    .exec()
    .then((result) => {
      console.log(result);
      result.length
        ? res
            .status(500)
            .json({
              message: `student found with same rollNo and classNo`,
              student: result,
            })
        : student.save().then((result) => {
            console.log(result);
            res.status(201).json({
              message: "New student added successfully",
            });
          });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/:studentId", (req, res, next) => {
    const id = req.params.studentId;
    Student.findById(id)
      .exec()
      .then((result) => {
        result
          ? res.status(200).json(result)
          : res.status(404).json({ error: "No records found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });

module.exports = router;
