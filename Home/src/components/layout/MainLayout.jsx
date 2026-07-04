import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d1b2a] font-sans text-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto relative flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;