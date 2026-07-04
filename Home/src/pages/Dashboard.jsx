import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/ui/Card";

function Dashboard() {
  const [totalPackages, setTotalPackages] = useState(0);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("viz_currentUser"));
    if (user) {
      // Pass the user's email to the backend to filter the count
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      fetch(`${apiUrl}/packages/count?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => setTotalPackages(data.count))
        .catch((err) => console.error("Failed to fetch stats", err));
    }
  }, []);

  return (
    <MainLayout>
      <h1 className="text-3xl font-display font-bold text-white mb-6">
        Vendor Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <Card>
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
            Total Listings
          </h3>
          <p className="text-4xl font-bold text-white mt-2">{totalPackages}</p>
        </Card>
        <Card>
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
            Storage Mode
          </h3>
          <p className="text-2xl font-bold text-cyan mt-2">MongoDB Atlas</p>
        </Card>
        <Card>
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
            Active Status
          </h3>
          <p className="text-2xl font-bold text-green-500 mt-2">Online</p>
        </Card>
        <Card>
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
            Platform
          </h3>
          <p className="text-2xl font-bold text-blueacc mt-2">viztravel.in</p>
        </Card>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
