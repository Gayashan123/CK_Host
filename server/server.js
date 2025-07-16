import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

// Import routes
import connectDB from "./config/connectToDb.js";
import shopRoutes from "./routes/shopRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import authRoutes from "./routes/auth.route.js";
import siteUserRoutes from "./routes/siteUser.routes.js";
import commentRoutes from "./routes/comment.route.js";
import placesRoutes from "./routes/place.route.js";
import placeCategory from "./routes/place.catego.route.js";
import Placecomm from "./routes/pcomment.route.js";

// Config paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "config", ".env") });

if (!process.env.DB_URL) throw new Error("DB_URL is not set in .env!");
if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set in .env!");

// Initialize Express
const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://ck-host-zddt.vercel.app",
  "https://ck-host-zddt-git-main-gayashan123s-projects.vercel.app"
];

// Enhanced CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      collectionName: "sessions",
      ttl: 7 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.NODE_ENV === "production" ? ".railway.app" : undefined
    },
  })
);

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "Server running ✅",
    session: req.session,
    user: req.user,
  });
});

// API routes
app.use("/api/shops", shopRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/siteuser", siteUserRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/place", placesRoutes);
app.use("/api/placecat", placeCategory);
app.use("/api/placecomment", Placecomm);

// Port
const PORT = process.env.PORT || 5001;

// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API: ${process.env.NODE_ENV === "production" ? "https://observant-vibrancy-production.up.railway.app" : `http://localhost:${PORT}`}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1);
  });