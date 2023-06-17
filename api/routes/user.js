const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../module/userModule");
const checkAuth = require("../middleware/check-auth")

const router = express.Router();

router.post("/signup", (req, res, next) => {
  User.find({ username: req.body.username })
  .exec()
    .then((user) => {
      if (!user.length) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res
              .status(500)
              .json({ code: "1005", error: err, message: "Error found in password" });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
              phoneNumber: req.body.phoneNumber,
              email: req.body.email,
              userType: req.body.userType,
            });
      
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "New user added successfullhy",
                  data: result,
                });
              })
              .catch((err) => {
                res.status(500).json({ code: "1006", error: err });
              });
          }
        });
      } else {
        res.status(401).json({
          code: "1004",
          message: "User already exist",
        });
      }
    })
});

router.post("/login", (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(401).json({
          code: "1002",
          message: "Invalied username!",
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (!result) {
            return res
              .status(401)
              .json({ code: "1003", message: "Invalied password!" });
          } else {
            const token = jwt.sign(
              {
                username: user[0].username,
                userType: user[0].userType,
                phoneNumber: user[0].phoneNumber,
                email: user[0].email,
              },
              "secretOrPrivateKey",
              { expiresIn: "02h" }
            );
            return res.status(200).json({
              username: user[0].username,
              userType: user[0].userType,
              phoneNumber: user[0].phoneNumber,
              email: user[0].email,
              token: token,
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ code: "1001", error: err });
    });
});

// router.patch("/resetPassword", checkAuth, (req, res, next) => {
router.patch("/resetPassword", (req, res, next) => {
  User.find({ username: req.body.username, email: req.body.email })
    .exec()
    .then((user) => {
      const userId = user[0]._id
      if (user.length) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res
              .status(500)
              .json({ code: "1008", error: err, message: "Error found in password" });
          } else {
            User.updateOne({ _id: userId }, { $set:{password: hash} })
              .exec()
              .then((result) => {
                res.status(200).json({
                  message: "Password updated successfully.",
                  details: result,
                });
              })
              .catch((err) => {
                res.status(500).json({ code: "1009", error: err });
              });
          }
        })
      } else {
        res.status(401).json({
          code: "1007",
          message: "Invalied username or email!",
        });
      }
    });
});
module.exports = router;
