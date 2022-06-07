const express = require("express");

const router = express.Router();

router.get('/',(req, res, next) => {
    return res.status(200).json({
        msg:"get teacher Request"
    })
});

router.post('/',(req, res, next) => {
    return res.status(201).json({
        msg:"post teacher Request"
    })
});

module.exports = router;
