import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ email: "admin@example.com" });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  await Admin.create({
    email: "admin@example.com",
    password: "12345678", // plain password (will be hashed)
  });

  console.log("✅ Admin created successfully");
  process.exit();
};

run();
