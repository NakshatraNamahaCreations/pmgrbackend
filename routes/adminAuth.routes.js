import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
});


router.post("/create-admin", async (req, res) => {
  const bcrypt = await import("bcryptjs");
  const Admin = (await import("../models/Admin.js")).default;

  const hashedPassword = await bcrypt.hash("12345678", 10);

  const admin = await Admin.create({
    email: "admin@123.com",
    password: hashedPassword,
  });

  res.json({
    message: "Admin created",
    admin,
  });
});


export default router;
