import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function MyPackages() {
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [imageIndices, setImageIndices] = useState({});

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const userString = sessionStorage.getItem("viz_currentUser");
    if (userString) {
      const user = JSON.parse(userString);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/packages/my-packages?email=${user.email}`);
        const data = await res.json();
        if (res.ok) setPackages(data);
      } catch (err) {
        console.error("Server connection error:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      await fetch(`${apiUrl}/packages/${id}`, { method: "DELETE" });
      setPackages(packages.filter((pkg) => pkg._id !== id));
    }
  };

  const handleEditClick = (pkg) => {
    setEditingId(pkg._id);
    setEditForm(pkg);
  };

  const handleUpdate = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    const res = await fetch(`${apiUrl}/packages/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setEditingId(null);
      fetchPackages();
    } else {
      alert("Failed to update the listing.");
    }
  };

  const nextImage = (pkgId, maxImages) => {
    setImageIndices((prev) => ({ ...prev, [pkgId]: ((prev[pkgId] || 0) + 1) % maxImages }));
  };

  const prevImage = (pkgId, maxImages) => {
    setImageIndices((prev) => ({ ...prev, [pkgId]: ((prev[pkgId] || 0) - 1 + maxImages) % maxImages }));
  };

  const myTours = packages.filter(pkg => pkg.category === "Tour" || !pkg.category);
  const myHotels = packages.filter(pkg => pkg.category === "Hotel");

  const renderPackageCard = (pkg, isHotel) => {
    const currentIndex = imageIndices[pkg._id] || 0;
    const images = pkg.images || [];
    const hasMultipleImages = images.length > 1;
    const themeColor = isHotel ? "text-green-400" : "text-cyan";
    const borderColor = isHotel ? "border-green-500" : "border-cyan";

    return (
      <Card key={pkg._id} className={`relative flex flex-col h-full border-t-4 ${borderColor}`}>
        {editingId === pkg._id ? (
          <div className="flex flex-col gap-4">
            <h3 className={`${themeColor} font-bold`}>Edit {isHotel ? "Hotel" : "Tour"}</h3>
            <Input label="Title" value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            <Input label="Price (₹)" type="number" value={editForm.price || ""} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
            <Button variant="success" onClick={handleUpdate}>Save Changes</Button>
            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
          </div>
        ) : (
          <>
            {/* IMAGE SLIDER WITH VISIBLE ARROWS */}
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shrink-0">
              {images.length > 0 ? (
                <img src={images[currentIndex]} alt={pkg.title} className="w-full h-full object-cover transition-opacity duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Photos</div>
              )}

              {/* Slider Arrows (Always Visible) */}
              {hasMultipleImages && (
                <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(pkg._id, images.length); }}
                    className="pointer-events-auto bg-black/60 text-white w-8 h-8 rounded-full hover:bg-cyan flex items-center justify-center font-bold"
                  >❮</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(pkg._id, images.length); }}
                    className="pointer-events-auto bg-black/60 text-white w-8 h-8 rounded-full hover:bg-cyan flex items-center justify-center font-bold"
                  >❯</button>
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-white line-clamp-1">{pkg.title || "Unnamed Listing"}</h2>
            <p className={`text-sm ${themeColor} font-semibold mb-2`}>📍 {pkg.location}</p>
            <p className={`text-2xl font-bold ${themeColor} mb-4`}>₹{pkg.price}</p>
            <p className="text-sm text-gray-400 mb-6 line-clamp-3 flex-grow">{pkg.description}</p>

            <div className="flex gap-3 border-t border-gray-700 pt-4 mt-auto">
              <Button variant="primary" onClick={() => handleEditClick(pkg)} className="flex-1">Edit</Button>
              <Button variant="danger" onClick={() => handleDelete(pkg._id)} className="flex-1">Delete</Button>
            </div>
          </>
        )}
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pb-10">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Manage My Listings</h1>
        <div className="flex flex-col gap-12">
          <div>
            <h2 className="text-2xl font-bold text-cyan mb-6 border-b border-gray-700 pb-2">🎒 My Tour Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTours.map((pkg) => renderPackageCard(pkg, false))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-500 mb-6 border-b border-gray-700 pb-2">🏨 My Hotels & Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myHotels.map((pkg) => renderPackageCard(pkg, true))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default MyPackages;
