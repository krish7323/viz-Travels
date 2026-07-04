const express = require('express');
const Package = require('../models/PackageModel');

const router = express.Router();

// 0. Get ALL packages at root path too (frontend calls this directly)
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find()
      .select({ title: 1, price: 1, location: 1, category: 1, timestamp: 1, images: { $slice: 1 } })
      .lean();

    packages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedPackages = packages.slice(0, 30);

    return res.status(200).json(limitedPackages);
  } catch (err) {
    console.error("Error on GET /:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 1. MUST BE BEFORE /:id: Get ALL packages
router.get("/all", async (req, res) => {
  try {
    const packages = await Package.find()
      .select({ title: 1, price: 1, location: 1, category: 1, timestamp: 1, images: { $slice: 1 } })
      .lean();

    packages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedPackages = packages.slice(0, 30);

    return res.status(200).json(limitedPackages);
  } catch (err) {
    console.error("Error on GET /all:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 2. Get total count
router.get("/count", async (req, res) => {
  try {
    const { email } = req.query;
    const count = await Package.countDocuments({ vendorEmail: email });
    return res.status(200).json({ count });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Get logged-in user's packages
router.get("/my-packages", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const packages = await Package.find({ vendorEmail: email })
      .select({ title: 1, price: 1, location: 1, category: 1, timestamp: 1, images: { $slice: 1 }, description: 1, mood: 1, roomType: 1 })
      .lean();
    
    packages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedPackages = packages.slice(0, 50);
    
    return res.status(200).json(limitedPackages);
  } catch (err) {
    console.error("Error on GET /my-packages:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 4. Add a new package
router.post("/", async (req, res) => {
  try {
    const createdPackage = await Package.create(req.body);
    return res.status(201).json({ message: "Package added successfully!", data: createdPackage });
  } catch (err) {
    console.error("Error on POST /:", err);
    return res.status(400).json({ error: err.message });
  }
});

// 5. Get a single package by ID
router.get("/:id", async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    return res.status(200).json(pkg);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 6. Update a package
router.put("/:id", async (req, res) => {
  try {
    const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updatedPackage);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// 7. Delete a package
router.delete("/:id", async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Package deleted successfully!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
