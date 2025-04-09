import express from "express";
import dotenv from "dotenv";
import { connectToDb } from "./src/db/db.js";
import "colors";
import authRoutes from "./src/routes/authRoutes.js";
import documentRoutes from "./src/routes/documents.routes.js";
import cors from "cors";
import subscriptionRoutes from "./src/routes/subscriptionRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000", "https://universal-translator-fe.vercel.app", "https://universal-translator-steel.vercel.app", "https://translator-dun-five.vercel.app/"],
    credentials: true,
  })
);
connectToDb();

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/subscription", subscriptionRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgYellow);
});
