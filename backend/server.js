import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://admission-automation-system.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.set("trust proxy", 1); // For deployment proxies like Render/Heroku

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    name: "admission.sid",
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, 
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? "none" : "lax",// 1 hour
    },
  })
);

app.use(authRoutes);


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 8000, "0.0.0.0", () =>
      console.log(`✅ Server running on ${process.env.PORT || 8000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });


