import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronDown, FiUser, FiMail, FiLogOut } from "react-icons/fi";

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "Vendor", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(sessionStorage.getItem("viz_currentUser"));
    if (savedUser) {
      setUserData(savedUser);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("viz_currentUser");
    navigate("/login");
  };

  return (
    <header className="bg-[#0a1522] h-16 flex items-center justify-between px-6 sticky top-0 z-50 border-b border-gray-800 shrink-0">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <span className="text-2xl text-white flex items-center justify-center shrink-0">✈</span>
        <span className="font-display text-xl font-bold text-white whitespace-nowrap">
          Viz <span className="text-[#00b4d8]">Travels</span>
        </span>
      </Link>
      <div className="flex items-center gap-4 relative">
        <span className="hidden sm:inline-block border border-gray-600 text-[#00b4d8] text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-sm">
          Vendor Portal
        </span>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2 hover:bg-white/5 py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#00b4d8] text-[#0d1b2a] flex items-center justify-center font-bold shadow-md uppercase">
            {userData.name.charAt(0)}
          </div>
          <span className="text-sm font-medium text-white">{userData.name}</span>
          <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>

        {isProfileOpen && (
          <div className="absolute top-full right-0 mt-3 w-56 bg-[#112438] border border-gray-700 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-800 mb-1">
              <p className="text-sm text-white font-semibold truncate">{userData.name}</p>
              <p className="text-xs text-gray-400 truncate">{userData.email}</p>
            </div>
            <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
              <FiUser className="w-4 h-4" /> My Profile
            </Link>
            <button onClick={() => { alert("Redirecting to Admin Support..."); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left">
              <FiMail className="w-4 h-4" /> Contact Admin
            </button>
            <div className="border-t border-gray-800 mt-1 pt-1">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left">
                <FiLogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;