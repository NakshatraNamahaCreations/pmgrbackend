import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminBlogRoutes from "./routes/adminBlog.routes.js";
import blogRoutes from "./routes/blog.routes.js";

/* ======================
   ENV + DB
====================== */
dotenv.config();
connectDB();

/* ======================
   APP INIT
====================== */
const app = express();

/* ======================
   CORS (EXPRESS 5 + NODE 22 SAFE)
====================== */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://pmgrandco.com",
  "https://www.pmgrandco.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-side, Postman, curl
      if (!origin) return callback(null, true);

      // Allow Netlify preview URLs
      if (origin.endsWith(".netlify.app")) {
        return callback(null, true);
      }

      // Allow known origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❌ DO NOT throw errors here (Express 5 will crash / 500)
      // ✅ Silently block unknown origins
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ======================
   BODY & COOKIES
====================== */
app.use(express.json());
app.use(cookieParser());

/* ======================
   STATIC FILES
====================== */
app.use("/uploads", express.static("uploads"));

/* ======================
   ROUTES
====================== */
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/blogs", blogRoutes);

/* ======================
   HEALTH CHECK (OPTIONAL BUT RECOMMENDED)
====================== */
app.get("/", (req, res) => {
  res.json({ status: "API running" });
});

/* ======================
   SERVER START
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
