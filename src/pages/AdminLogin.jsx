import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Use your deployed backend URL (Express server)
const API_LOGIN = "https://client-ylky.onrender.com/api/admin/login";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);

      // ✅ Ensure JSON headers are sent
      const res = await axios.post(
        API_LOGIN,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ Check token
      if (!res.data?.token) {
        alert("Login succeeded but token missing!");
        return;
      }

      // ✅ Save token & username
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username);

      alert("Login successful 🎉");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      // ✅ Improved error message
      const message =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Invalid credentials. Please try again!"
          : "Login failed. Please check the server connection.");

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto mt-10 shadow-lg rounded-lg bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className={`${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } text-white py-3 rounded transition`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
