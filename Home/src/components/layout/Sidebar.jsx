import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiPlusSquare, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menu = [
    { title: "Dashboard", path: "/", icon: <FiHome className="w-5 h-5" /> },
    { title: "Add Package", path: "/add-package", icon: <FiPlusSquare className="w-5 h-5" /> },
    { title: "My Packages", path: "/my-packages", icon: <FiPlusSquare className="w-5 h-5" /> },
    { title: "Profile", path: "/profile", icon: <FiUser className="w-5 h-5" /> },
  ];

  return (
    <aside className={`${isCollapsed ? "w-20" : "w-64"} bg-[#0d1b2a] border-r border-gray-800 h-full flex flex-col z-40 transition-all duration-300 relative shrink-0 pt-6`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-4 w-8 h-8 bg-[#00b4d8] text-[#0d1b2a] rounded-full shadow-lg z-50 border-[3px] border-[#0d1b2a] hover:scale-110 transition-transform flex items-center justify-center shrink-0"
      >
        {isCollapsed ? <FiChevronRight className="w-4 h-4 ml-0.5" /> : <FiChevronLeft className="w-4 h-4 mr-0.5" />}
      </button>
      <nav className="flex flex-col px-3 gap-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.title : ""}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden whitespace-nowrap ${isActive
                ? "bg-[#00b4d8] text-[#0d1b2a] shadow-md"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
              } ${isCollapsed ? "justify-center" : "justify-start"}`
            }
          >
            <div className="shrink-0">{item.icon}</div>
            <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'}`}>
              {item.title}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;