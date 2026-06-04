import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
      <h2 className="font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <span>
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;