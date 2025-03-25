import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined.");
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  try {
    const token = req.headers.authorization?.split(" ")[1]; // Expecting Bearer <token>
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: "User not found." });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({
        message: "Email not verified. Please verify your email to continue.",
      });
      return;
    }

    req.user = user; // Attach user to the request object
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Authentication error:", error);
    if (error?.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired. Please log in again." });
      return;
    }
    res.status(401).json({ message: "Invalid token." });
  }
};
