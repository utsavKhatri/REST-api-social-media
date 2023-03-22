const jwt = require("jsonwebtoken");
module.exports = async function (req, res, next) {
  // Check for the presence of a JWT token in the authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  // Verify the JWT token and extract the user data
  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = await jwt.verify(token, process.env.SECRET);
    req.user = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};
