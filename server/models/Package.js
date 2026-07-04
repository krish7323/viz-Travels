import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  vendorEmail: { type: String, required: true }, 
  category: { type: String, enum: ["Tour", "Hotel"], default: "Tour" }, 
  // Add these inside your PackageSchema
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
  duration: { type: String, default: "" }, // e.g., "3 Days / 2 Nights"

  // --- SEPARATE FIELDS FOR HOTELS ---
  roomType: { type: String, default: "" }, // e.g., "Deluxe Suite"
  amenities: { type: String, default: "" }, // e.g., "WiFi, Pool, AC"

  timestamp: { type: Date, default: Date.now }
});

const Package = mongoose.models.Package || mongoose.model("Package", packageSchema);
export default Package;
