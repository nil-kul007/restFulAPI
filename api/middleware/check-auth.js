const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const verify = jwt.verify(token, "secretOrPrivateKey");
        next();
    } catch (err) {
        res.status(401).json({
          code: "3000",
          message: "Unauthorised user token",
          error: err,
        });
    }
}