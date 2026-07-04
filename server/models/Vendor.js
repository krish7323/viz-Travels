
import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model("Vendor", vendorSchema);
