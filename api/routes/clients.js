const express = require("express");
const mongoose = require("mongoose");
const Clients = require("../module/clientsModule");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", checkAuth, (req, res, next) => {
  Clients.find()
    .select("_id clientName client_TIN phoneNumber email address")
    .exec()
    .then((result) => {
      res.status(200).json({
        count: result.length,
        clients: result,
      });
    })
    .catch((err) => {
      res.status(404).json({ code: "2001", error: err });
    });
});

router.post("/", checkAuth, (req, res, next) => {
  Clients.find({ client_TIN: req.body.client_TIN })
    .exec()
    .then((result) => {
      const client = new Clients({
        _id: mongoose.Types.ObjectId(),
        clientName: req.body.clientName,
        client_TIN: req.body.client_TIN,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        address: req.body.address,
      });
      if (result.length) {
        res.status(500).json({
          code: "2002",
          message: `Client already available.`,
          client: result,
        });
      } else {
        return client.save();
      }
    })
    .then((result) => {
      res.status(201).json({
        message: "New client added successfully",
        client: result
      });
    })
    .catch((err) => {
      res.status(500).json({ code: "2001", error: err });
    });
});

router.get("/:clientId", checkAuth, (req, res, next) => {
  const id = req.params.clientId;
  Clients.findById(id)
    .exec()
    .then((result) => {
      result
        ? res.status(200).json(result)
        : res.status(404).json({ code: "2003", error: "No records found" });
    })
    .catch((err) => {
      res.status(500).json({ code: "2001", error: err });
    });
});

router.patch("/:clientId", checkAuth, (req, res, next) => {
  const id = req.params.clientId;
  const updateData = {};
  for (data of req.body) {
    updateData[data.key] = data.value;
  }
  // console.log(updateData);
  Clients.updateOne({ _id: id }, { $set: updateData })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Client record updated successfully.",
        details: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ code: "2001", error: err });
    });
});

router.delete("/:clientId", checkAuth, (req, res, next) => {
  const id = req.params.clientId;
  Clients.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        _id: id,
        message: "Client deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({ code: "2001", error: err });
    });
});

// router.put("/:studentId", checkAuth, (req, res, next) => {
//   const id = req.params.studentId;
//   Student.findOneAndUpdate(
//     { _id: id },
//     {
//       $set: {
//         name: req.body.name,
//         gender: req.body.gender,
//         rollNo: req.body.rollNo,
//         contact: req.body.contact,
//         email: req.body.email,
//         address: req.body.address,
//         classNo: req.body.classNo,
//         pic: req.body.pic,
//       },
//     }
//   )
//     .exec()
//     .then((result) => {
//       res.status(200).json({
//         _id: id,
//         message: "Student updated successfully",
//         data: result,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({ code: "2001", error: err });
//     });
// });
module.exports = router;
