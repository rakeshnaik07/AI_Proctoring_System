import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/exams") return "Exams";
    if (path === "/results") return "Results";
    if (path === "/profile") return "Profile";
    if (path.startsWith("/admin/create-exam")) return "Create Exam";
    if (path.startsWith("/admin/add-question")) return "Add Question";
    if (path.startsWith("/admin/manage-exams")) return "Manage Exams";
    return "Dashboard";
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6">

      {/* Left: page title */}
      <h2 className="text-sm font-semibold text-zinc-900">
        {getPageTitle()}
      </h2>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3">
        
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-xs font-semibold text-violet-700">
            {initials}
          </div>
          <span className="text-sm text-zinc-700 font-medium">
            {user?.name}
          </span>
        </div>

        <div className="w-px h-4 bg-zinc-200" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-red-500 transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Navbar;

