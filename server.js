import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminBlogRoutes from "./routes/adminBlog.routes.js";
import blogRoutes from "./routes/blog.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / curl / server-side
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://pmgrandco.com",
        "https://www.pmgrandco.com",
      ];

      // Allow Netlify preview URLs
      if (origin.endsWith(".netlify.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);



app.use(express.json());
app.use(cookieParser()); // 🔥 THIS WAS MISSING
app.use("/uploads", express.static("uploads"));

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

