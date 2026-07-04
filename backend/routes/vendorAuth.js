const express = require('express');
const bcrypt = require('bcrypt');
const Vendor = require('../models/VendorModel');

const router = express.Router();

// 1. REGISTER ROUTE (Creates new account)
router.post("/register", async (req, res) => {
  const { companyName, email, password } = req.body;
  
  try {
    // Check if email already exists
    let existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Account already exists! Please sign in instead." });
    }

    // Hash the password and save to database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({ companyName, email, password: hashedPassword });
    await newVendor.save();

    // Send back user data so frontend can log them in immediately
    res.status(201).json({ name: newVendor.companyName, email: newVendor.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. LOGIN ROUTE (Verifies existing account)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find the user by email
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Account not found. Please register first." });
    }

    // Compare the entered password with the saved hashed password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    // If password is correct, send back user data
    res.json({ name: vendor.companyName, email: vendor.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
