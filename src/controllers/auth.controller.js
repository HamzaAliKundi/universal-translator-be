import jwt from "jsonwebtoken";
import sendVerificationEmail from "../services/emailService.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.model.js";
import { Payment } from "../models/PaymentSchema.js";

const signup = catchAsync(async (req, res) => {
  const { email, password, username } = req.body;

  // Validate required fields
  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ message: "Email, username, and password are required" });
  }

  // Check if the username is already taken
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res
      .status(400)
      .json({ message: "Username is already taken. Please choose another." });
  }

  // Check if the user already exists with the same email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      // If the user exists but is not verified, delete the unverified account
      await User.findByIdAndDelete(existingUser.id);
    }
  }

  // Generate a verification token
  const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Create a new user
  const newUser = new User({
    email,
    password, // The password will be hashed automatically by the pre-save hook
    username,
    verificationToken,
  });

  // Save the user in the database
  await newUser.save();

  // Send verification email
  await sendVerificationEmail(email, verificationToken);

  return res.status(201).json({
    message:
      "User created successfully. Please check your email to verify your account.",
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Find the user and cast it to IUser
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the user's email is verified
  if (!user.isVerified) {
    return res.status(400).json({ message: "Please verify your email" });
  }

  // Compare the entered password with the stored hashed password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate a JWT token for the user
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  return res.status(200).json({ message: "Login successful", token, user });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.params;

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and verify their email
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).send(`
          <h1>Invalid Token</h1>
          <p>The link you used is invalid or has expired.</p>
          <a href="${process.env.FRONT_END_URL}/resend-verification">Resend Verification Email</a>
        `);
    }

    if (user.isVerified) {
      return res.status(200).send(`
          <h1>Email Already Verified</h1>
          <p>Your email has already been verified. Please proceed to log in.</p>
          <a href="${process.env.FRONT_END_URL}">Go to Login</a>
        `);
    }

    // Verify user and update token to prevent reuse
    user.isVerified = true;
    user.verificationToken = "null";
    await user.save();

    // Respond with an HTML message
    return res.status(200).send(`
        <h1>Email Verified</h1>
        <p>Thank you! Your email has been successfully verified.</p>
        <a href="${process.env.FRONT_END_URL}/login">Click here to log in</a>
      `);
  } catch (error) {
    return res.status(400).send(`
        <h1>Invalid or Expired Token</h1>
        <p>It seems this verification link is no longer valid.</p>
        <a href="${process.env.FRONT_END_URL}/resend-verification">Resend Verification Email</a>
      `);
  }
});

const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const userExists = await User.findOne({ username });
    console.log("Database query result:", userExists);

    if (userExists) {
      return res
        .status(200)
        .json({ available: false, message: "Username is already taken" });
    }

    return res
      .status(200)
      .json({ available: true, message: "Username is available" });
  } catch (error) {
    console.error("Error checking username:", error.message);
    return res
      .status(500)
      .json({ message: "An error occurred while checking the username" });
  }
};

const getUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID from the token
    const user = await User.findById(decoded.userId).select("-password"); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user data
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    res
      .status(500)
      .json({ message: "An error occurred while fetching user details" });
  }
};

const checkHasPaid = async (req, res) => {
  const user = req?.user;
  const free = 3;
  try {
    const payments = await Payment.find({ userId: user?._id });
    const paidPayments = payments.filter(
      (payment) => payment.status === "succeeded"
    );
    const hasPaid = free + paidPayments.length > user.numRequests;
    const remainingRequests = free + paidPayments.length - user.numRequests;
    res.status(200).json({ hasPaid, remainingRequests });
  } catch (error) {
    console.error("Error checking payments:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while checking payment status" });
  }
};

export { signup, login, verifyEmail, checkUsername, getUser, checkHasPaid };
