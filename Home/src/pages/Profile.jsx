import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/ui/Card";

function Profile() {
  const [userData, setUserData] = useState({ name: "", email: "" });

  useEffect(() => {
    // Read the saved user from local storage
    const savedUser = JSON.parse(sessionStorage.getItem("viz_currentUser"));
    if (savedUser) {
      setUserData(savedUser);
    }
  }, []);

  return (
    <MainLayout>
      <h1 className="text-3xl font-display font-bold text-white mb-6">
        Vendor Profile
      </h1>

      <Card className="max-w-md">
        <h2 className="text-xl font-semibold text-cyan mb-4">Account Details</h2>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Company Name</span>
            {/* Dynamic Name */}
            <span className="text-white font-medium">{userData.name}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Email</span>
            {/* Dynamic Email */}
            <span className="text-white font-medium">{userData.email}</span>
          </div>

          <div className="flex justify-between pb-2">
            <span className="text-gray-400">Access Level</span>
            <span className="text-green-400 font-medium">Verified Vendor</span>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
}

export default Profile;
