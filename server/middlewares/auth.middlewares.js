const { verifyToken } = require("../lib/utils");
const User = require("../models/user.model");

const protectRoute = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Token is not valid" });
  }
  console.log("decoded", decoded);

  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(404).send("User not found");
  }
  req.user = user;
  next();
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // return res.status(403).json({ message: "No permission" });
      return res.redirect("/");
    }
    next();
  };
};

module.exports = { protectRoute, authorizeRole };
