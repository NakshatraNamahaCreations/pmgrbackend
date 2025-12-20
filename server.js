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
      if (!origin) return callback(null, true);

      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      if (origin.endsWith(".netlify.app")) {
        return callback(null, true);
      }

      const allowedDomains = ["https://www.yourdomain.com"];
      if (allowedDomains.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy: Origin not allowed"), false);
    },
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
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
