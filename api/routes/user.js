const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../module/userModule");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ error: err, message: "Error found in password" });
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
          res.status(500).json({ error: err });
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(401).json({
          message: "Invalied username!",
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (!result) {
            return res.status(401).json({ message: "Invalied password!" });
          } else {
            const token = jwt.sign(
              {
                username: user[0].username,
                userType: user[0].userType,
                phoneNumber: user[0].phoneNumber,
                email: user[0].email,
              },
              "secretOrPrivateKey",
              { expiresIn: '02h' }
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
      res.status(500).json({ error: err });
    });
});
module.exports = router;
