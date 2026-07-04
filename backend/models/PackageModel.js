const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  vendorEmail: { type: String, required: true }, 
  category: { type: String, enum: ["Tour", "Hotel"], default: "Tour" }, 
  travelClass: [{ title: String, price: Number }],
  dining: [{ title: String, price: Number }],
  transport: [{ title: String, price: Number }],
  customOptions: [{ title: String, extraPrice: Number }],
  
  title: { type: String, required: true },       
  location: { type: String, required: true },    
  price: { type: Number, required: true }, 
  discount: { type: Number, default: 0 },   
  description: { type: String, required: true }, 
  images: { type: [String], required: true },

  // --- SEPARATE FIELDS FOR TOURS ---
  tourGuide: { type: String, default: "Assigned Later" }, 
  mood: { type: String, default: "General" },        
  duration: { type: String, default: "" }, 

  // --- SEPARATE FIELDS FOR HOTELS ---
  roomType: { type: String, default: "" }, 
  amenities: { type: String, default: "" }, 

  timestamp: { type: Date, default: Date.now }
});

const Package = mongoose.models.Package || mongoose.model("Package", packageSchema);
module.exports = Package;
