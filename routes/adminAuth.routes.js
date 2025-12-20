import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const admin = await Admin.findOne({ email: normalizedEmail });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    admin: {
      id: admin._id,
      email: admin.email,
    },
  });
});


// router.post("/create-admin", async (req, res) => {
//   const bcrypt = await import("bcryptjs");
//   const Admin = (await import("../models/Admin.js")).default;

//   const hashedPassword = await bcrypt.hash("12345678", 10);

//   const admin = await Admin.create({
//     email: "admin@pmgrco.com",
//     password: hashedPassword,
//   });

//   res.json({
//     message: "Admin created",
//     admin,
//   });
// });


router.post("/reset-admin-password", async (req, res) => {
  const bcrypt = await import("bcryptjs");

  const hashedPassword = await bcrypt.hash("12345678", 10);

  const admin = await Admin.findOneAndUpdate(
    { email: "admin@pmgrco.com" },
    { password: hashedPassword },
    { new: true }
  );

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  res.json({
    message: "Admin password reset to 12345678",
    email: admin.email,
  });
});


export default router;
