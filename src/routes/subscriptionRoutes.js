import express from "express";
import Stripe from "stripe";
import User from "../models/user.model.js";
import { configDotenv } from "dotenv";
import { Payment } from "../models/PaymentSchema.js";

configDotenv();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
router.post("/create-payment-intent", async (req, res) => {
  const { userId } = req.body;

  if (!userId)
    return res.status(400).json({
      status: "fail",
      message: "User ID is required",
    });

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate the amount (e.g., $1.99 per file)
    const amount = 199;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency: "usd",
      metadata: { userId },
    });

    // Send the client secret to the frontend
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/confirm-payment", async (req, res) => {
  const { userId, transactionId, purpose } = req.body;

  if (!userId || !transactionId || !purpose) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check payment status from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

    if (paymentIntent.status === "succeeded") {
      // Save the payment in the database
      const payment = new Payment({
        userId,
        amount: paymentIntent.amount / 100, // Convert to dollars
        status: paymentIntent.status,
        transactionId: paymentIntent.id,
        purpose,
      });
      await payment.save();

      res.status(200).json({ message: "Payment recorded successfully" });
    } else {
      res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ message: "Error confirming payment" });
  }
});

export default router;
