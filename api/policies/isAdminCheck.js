const jwt = require("jsonwebtoken");

/**
 * This is a middleware function.
 * @param {token} req
 * @return procced
 * @rejects {Error}
 */
module.exports = async (req, res, next) => {
  try {
    // Extract the token from req session
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    // Verify the token
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(403).send("Forbidden");
      }
      // Add the decoded token to the request object
      req.user = decodedToken;
      const user = await User.findOne({ id: decodedToken.id });
      if (!user || !user.token) {
        return res.status(401).send("Token expired");
      }
      if (user.token !== token) {
        return res.status(401).send("Unauthorized");
      }
      // Call the next middleware or route handler
    });
    return next();
  } catch (error) {
    console.log(error);
    return res.status(403).send("Forbidden");
  }
};
