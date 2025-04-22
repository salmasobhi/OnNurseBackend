
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Received Authorization Header:", authHeader); // ✅ تحقق من وصول التوكن

  if (!authHeader) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    console.log("User making request:", req.user); // ✅ تحقق من البيانات بعد فك التوكن

    // if (!req.user.is_nurse) {
    //   return res.status(401).json({ error: "Unauthorized: Nurse ID is missing" });
    // }

    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

