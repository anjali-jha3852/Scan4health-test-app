import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // import the axios instance

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Enter username and password");

    try {
      setLoading(true);
      const res = await api.post("/api/admin/login", { username, password });

      if (!res.data?.token) return alert("Login succeeded but token missing!");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username);

      alert("Login successful 🎉");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.message ||
        "Login failed. Please check the backend connection";
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
