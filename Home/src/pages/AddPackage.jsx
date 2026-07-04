import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function AddPackage() {
  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: "", location: "", category: "Tour",
    price: "", discount: "", description: "", images: [],
    // Add the new categorized arrays here:
    travelClass: [],
    dining: [],
    transport: [],
    customOptions: [],
    mood: "", tourGuide: "", duration: "", roomType: "", amenities: ""
  });

  // State for the temporary input fields
  const [inputs, setInputs] = useState({
    travelTitle: "", travelPrice: "",
    diningTitle: "", diningPrice: "",
    transTitle: "", transPrice: "",
    genTitle: "", genPrice: ""
  });

  const handleFieldChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCategoryOption = (category, titleField, priceField) => {
    const title = inputs[titleField];
    const price = inputs[priceField];

    if (title && price) {
      setFormData(prev => ({
        ...prev,
        [category]: [...prev[category], { title, price: Number(price), extraPrice: Number(price) }]
      }));
      setInputs(prev => ({ ...prev, [titleField]: "", [priceField]: "" })); // Reset inputs
    }
  };

  const handleRemoveCategoryOption = (category, indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const [optionTitle, setOptionTitle] = useState("");
  const [optionPrice, setOptionPrice] = useState("");

  // Automatically switch to Tour or Hotel based on the Sidebar click!
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");

    if (type === "Hotel" || type === "Tour") {
      // 1. Reset the entire form and set the correct category
      setFormData({
        title: "", location: "", category: type,
        price: "", discount: "", description: "", images: [], customOptions: [],
        mood: "", tourGuide: "", duration: "", roomType: "", amenities: ""
      });
      // 2. Force the page back to Step 1
      setCurrentStep(0);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOption = () => {
    if (optionTitle && optionPrice) {
      setFormData(prev => ({
        ...prev,
        customOptions: [...prev.customOptions, { title: optionTitle, extraPrice: Number(optionPrice) }]
      }));
      setOptionTitle("");
      setOptionPrice("");
    }
  };

  const handleRemoveOption = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      customOptions: prev.customOptions.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const compressImage = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.6));
          };
        };
      });
    };

    const compressedImages = await Promise.all(files.map(file => compressImage(file)));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...compressedImages],
    }));
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.price || formData.images.length === 0) {
      alert("Please fill all required fields and upload at least one image.");
      return;
    }

    const currentUser = JSON.parse(sessionStorage.getItem("viz_currentUser"));
    const newPackage = {
      ...formData,
      vendorEmail: currentUser.email,
      price: formData.price ? Number(formData.price) : 0,
      discount: formData.discount ? Number(formData.discount) : 0,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/packages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPackage),
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        setFormData({
          title: "", location: "", category: "Tour", price: "", discount: "", description: "", images: [], customOptions: [],
          mood: "", tourGuide: "", duration: "", roomType: "", amenities: ""
        });
        setCurrentStep(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await res.json();
        alert(`Backend Error: ${data.message}`);
      }
    } catch (err) {
      alert(`Server connection failed: ${err.message}`);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-cyan text-xs font-bold tracking-[0.2em] uppercase mb-3">✈ Grow Your Business</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Add a New Listing</h1>
        </div>

        {showSuccess && (
          <div className="bg-green-900/40 border border-green-500 rounded-xl p-4 mb-6 flex items-center gap-4 transition-all">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">✓</div>
            <div>
              <p className="font-bold text-green-400 text-sm">Listing saved successfully!</p>
              <p className="text-xs text-green-200 mt-0.5">Check the "My Packages" tab to view it.</p>
            </div>
          </div>
        )}

        <div className="bg-navycard rounded-2xl shadow-2xl border border-gray-700 overflow-hidden mb-12">
          <div className="flex overflow-x-auto border-b border-gray-700 scrollbar-hide">
            {["Basic Info", "Pricing & Options", "Media", "Review"].map((step, i) => (
              <div key={step} onClick={() => i < currentStep && setCurrentStep(i)} className={`flex-1 min-w-[80px] text-center p-3 text-xs font-semibold cursor-pointer border-b-2 transition-colors ${currentStep === i ? "border-cyan text-cyan" : "border-transparent text-gray-500"}`}>
                <span className={`block w-6 h-6 mx-auto mb-1 rounded-full flex items-center justify-center ${currentStep === i ? "bg-cyan text-navy" : "bg-gray-800"}`}>{i + 1}</span>
                {step}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {currentStep === 0 && (
              <div className="flex flex-col gap-5">

                {/* GIANT TOGGLE BUTTONS */}
                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-sm font-bold text-white">What are you adding? <span className="text-cyan">*</span></label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: "Tour" }))}
                      className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all ${formData.category === "Tour" ? "border-cyan bg-cyan/20 text-cyan" : "border-gray-600 bg-gray-800 text-gray-400"}`}
                    >
                      🎒 Tour Package
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: "Hotel" }))}
                      className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all ${formData.category === "Hotel" ? "border-green-500 bg-green-500/20 text-green-400" : "border-gray-600 bg-gray-800 text-gray-400"}`}
                    >
                      🏨 Hotel / Stay
                    </button>
                  </div>
                </div>

                <Input label="Listing Title (Hotel Name or Tour Name)" name="title" value={formData.title} onChange={handleChange} placeholder={formData.category === "Hotel" ? "e.g., Luxury Taj Hotel" : "e.g., Phuket 5 Days Tour"} />
                <Input label="Location / City" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Mumbai" />

                {/* THE DYNAMIC SEPARATE FIELDS */}
                <div className="mt-4 border-t border-gray-700 pt-6">
                  <h3 className="text-white font-bold mb-4">{formData.category === "Hotel" ? "🏨 Property Details" : "🎒 Tour Details"}</h3>

                  {formData.category === "Hotel" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="Room Type" name="roomType" value={formData.roomType} onChange={handleChange} placeholder="e.g., Deluxe Suite, Single Room" />
                      <Input label="Amenities" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="e.g., Free WiFi, Pool, AC, Parking" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="Duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 3 Days / 2 Nights" />
                      <Input label="Guide Name (Optional)" name="tourGuide" value={formData.tourGuide} onChange={handleChange} placeholder="e.g., Rahul Sharma" />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-300">Mood / Category</label>
                        <select name="mood" value={formData.mood} onChange={handleChange} className="bg-navycard border border-gray-600 rounded-lg p-2.5 text-sm outline-none focus:border-cyan text-white">
                          <option value="">Select Mood</option>
                          <option value="Beach">Beach</option>
                          <option value="Mountain">Mountain</option>
                          <option value="City Break">City Break</option>
                          <option value="Heritage">Heritage</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <Input label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your offering..." textarea rows={4} />
              </div>
            )}

            {currentStep === 1 && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input label="Base Price per Person" type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g., 15000" />
                  <Input label="Discount %" type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="e.g., 10" />
                </div>

                {/* TOUR-SPECIFIC CUSTOMIZATION OPTIONS */}
                {formData.category === "Tour" && (
                  <div className="mt-4 border-t border-gray-700 pt-6">
                    <h3 className="text-white font-bold mb-4">✈ Travel Class Options</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <Input
                        placeholder="e.g., Business Class"
                        value={inputs.travelTitle}
                        onChange={(e) => handleFieldChange("travelTitle", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="e.g., 5000"
                        value={inputs.travelPrice}
                        onChange={(e) => handleFieldChange("travelPrice", e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddCategoryOption("travelClass", "travelTitle", "travelPrice")}
                        variant="outline"
                      >
                        + Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.travelClass.map((opt, idx) => (
                        <span key={idx} className="bg-cyan/20 text-cyan px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {opt.title} (+₹{opt.price})
                          <button type="button" onClick={() => handleRemoveCategoryOption("travelClass", idx)} className="text-cyan hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>

                    <h3 className="text-white font-bold mb-4 mt-6">🍽️ Dining Options</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <Input
                        placeholder="e.g., All Meals Included"
                        value={inputs.diningTitle}
                        onChange={(e) => handleFieldChange("diningTitle", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="e.g., 2000"
                        value={inputs.diningPrice}
                        onChange={(e) => handleFieldChange("diningPrice", e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddCategoryOption("dining", "diningTitle", "diningPrice")}
                        variant="outline"
                      >
                        + Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.dining.map((opt, idx) => (
                        <span key={idx} className="bg-cyan/20 text-cyan px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {opt.title} (+₹{opt.price})
                          <button type="button" onClick={() => handleRemoveCategoryOption("dining", idx)} className="text-cyan hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>

                    <h3 className="text-white font-bold mb-4 mt-6">🚗 Transport Options</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <Input
                        placeholder="e.g., Private Car"
                        value={inputs.transTitle}
                        onChange={(e) => handleFieldChange("transTitle", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="e.g., 3000"
                        value={inputs.transPrice}
                        onChange={(e) => handleFieldChange("transPrice", e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddCategoryOption("transport", "transTitle", "transPrice")}
                        variant="outline"
                      >
                        + Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.transport.map((opt, idx) => (
                        <span key={idx} className="bg-cyan/20 text-cyan px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {opt.title} (+₹{opt.price})
                          <button type="button" onClick={() => handleRemoveCategoryOption("transport", idx)} className="text-cyan hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* GENERAL CUSTOM OPTIONS (for both Tour and Hotel) */}
                <div className="mt-4 border-t border-gray-700 pt-6">
                  <h3 className="text-white font-bold mb-4">➕ Additional Custom Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <Input
                      placeholder="e.g., Airport Pickup"
                      value={optionTitle}
                      onChange={(e) => setOptionTitle(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="e.g., 1000"
                      value={optionPrice}
                      onChange={(e) => setOptionPrice(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={handleAddOption}
                      variant="outline"
                    >
                      + Add Option
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.customOptions.map((opt, idx) => (
                      <span key={idx} className="bg-cyan/20 text-cyan px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {opt.title} (+₹{opt.extraPrice})
                        <button type="button" onClick={() => handleRemoveOption(idx)} className="text-cyan hover:text-red-400">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-white">Upload Images <span className="text-cyan">*</span></label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="bg-navycard border border-gray-600 rounded-lg p-4 text-sm outline-none focus:border-cyan text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan file:text-navy hover:file:bg-cyan/80 cursor-pointer"
                  />
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col gap-6">
                <h3 className="text-white font-bold text-xl">Review Your Listing</h3>
                
                <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white font-semibold">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Title:</span>
                    <span className="text-white font-semibold">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white font-semibold">{formData.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base Price:</span>
                    <span className="text-white font-semibold">₹{formData.price}</span>
                  </div>
                  {formData.discount && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discount:</span>
                      <span className="text-white font-semibold">{formData.discount}%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Images:</span>
                    <span className="text-white font-semibold">{formData.images.length} uploaded</span>
                  </div>
                  
                  {formData.category === "Tour" && (
                    <>
                      {formData.travelClass.length > 0 && (
                        <div className="border-t border-gray-700 pt-3 mt-3">
                          <span className="text-gray-400">Travel Class Options:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.travelClass.map((opt, idx) => (
                              <span key={idx} className="bg-cyan/20 text-cyan px-2 py-1 rounded text-xs">
                                {opt.title} (+₹{opt.price})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {formData.dining.length > 0 && (
                        <div className="border-t border-gray-700 pt-3 mt-3">
                          <span className="text-gray-400">Dining Options:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.dining.map((opt, idx) => (
                              <span key={idx} className="bg-cyan/20 text-cyan px-2 py-1 rounded text-xs">
                                {opt.title} (+₹{opt.price})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {formData.transport.length > 0 && (
                        <div className="border-t border-gray-700 pt-3 mt-3">
                          <span className="text-gray-400">Transport Options:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.transport.map((opt, idx) => (
                              <span key={idx} className="bg-cyan/20 text-cyan px-2 py-1 rounded text-xs">
                                {opt.title} (+₹{opt.price})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {formData.customOptions.length > 0 && (
                    <div className="border-t border-gray-700 pt-3 mt-3">
                      <span className="text-gray-400">Additional Options:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.customOptions.map((opt, idx) => (
                          <span key={idx} className="bg-cyan/20 text-cyan px-2 py-1 rounded text-xs">
                            {opt.title} (+₹{opt.extraPrice})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-700 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Step <strong className="text-white">{currentStep + 1}</strong> of{" "}
                <strong>{totalSteps}</strong>
              </span>

              <div className="flex gap-3">
                {currentStep > 0 && <Button type="button" variant="outline" onClick={prevStep}>← Back</Button>}
                {currentStep === totalSteps - 1 ? (
                  <Button type="submit" variant="success">Publish Listing ✈</Button>
                ) : (
                  <Button type="button" onClick={nextStep}>Next →</Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}