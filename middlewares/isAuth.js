import "dotenv/config";
import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  // Get the 'Authorization' header from the incoming request
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "User is not authenticated." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_KEY);

    if (!verifiedToken) {
      return res.status(401).json({ message: "User is not authenticated." });
    }
    // Attach userId to request
    req.userId = verifiedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "User is not authenticated." });
  }
};

export default isAuth;
