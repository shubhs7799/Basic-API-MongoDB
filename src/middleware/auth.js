const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    } else {
      const decodedMsg = await jwt.verify(token, "SECREAT_KEY_2025");
      const { _id } = decodedMsg;
      const user = await User.findById(_id);

      if (!user) {
        throw new Error("User not exits.");
      } else {
        req.user =user;
        next();
      }
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

module.exports = userAuth;
