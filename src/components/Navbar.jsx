
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login"); // redirect to login after logout
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-lg">
        <Link to="/">Test App</Link>
      </div>
      <div className="flex gap-4">
        <Link to="/">Home</Link>

        {/* Show login only if not logged in */}
        {!token && <Link to="/admin/login">Admin Login</Link>}

        {/* Show dashboard + logout if logged in */}
        {token && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-2 py-1 rounded text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
