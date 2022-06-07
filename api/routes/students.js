const express = require("express");
const mongoose = require("mongoose");
const Student = require("../module/studentModule");
const checkAuth = require("../middleware/check-auth");
const cloudinary = require('cloudinary').v2;
const router = express.Router();

cloudinary.config({
  cloud_name: "dmydbbp2j",
  api_key: "943721756815656",
  api_secret: "ppt9baluGO4fXei5DD2gu1ethhI",
});

router.get("/", checkAuth, (req, res, next) => {
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

router.post("/", checkAuth, (req, res, next) => {
  Student.find({ rollNo: req.body.rollNo, classNo: req.body.classNo })
    .exec()
    .then((result) => {
      const student = new Student({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        gender: req.body.gender,
        rollNo: req.body.rollNo,
        contact: req.body.contact,
        email: req.body.email,
        address: req.body.address,
        classNo: req.body.classNo,
        pic: req.body.pic
      });
      // console.log(result);
      if (result.length) {
        res.status(500).json({
          message: `student found with same rollNo and classNo`,
          student: result,
        });
      } else {
        return student.save();
      }
    })
    .then((result) => {
      // console.log(result);
      res.status(201).json({
        message: "New student added successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/:studentId", checkAuth, (req, res, next) => {
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

router.patch("/:studentId", checkAuth, (req, res, next) => {
  const id = req.params.studentId;
  const updateData = {};
  for (data of req.body) {
    updateData[data.key] = data.value;
  }
  // console.log(updateData);
  Student.updateOne({ _id: id }, { $set: updateData })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Student record updated successfully.",
        updated: result,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:studentId", checkAuth, (req, res, next) => {
  const id = req.params.studentId;
  Student.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        _id: id,
        message: "Student deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.put("/:studentId", checkAuth, (req, res, next) => {
  const id = req.params.studentId;
  Student.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.name,
        gender: req.body.gender,
        rollNo: req.body.rollNo,
        contact: req.body.contact,
        email: req.body.email,
        address: req.body.address,
        classNo: req.body.classNo,
      },
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        _id: id,
        message: "Student updated successfully",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
