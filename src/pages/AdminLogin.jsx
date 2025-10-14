import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://client-ylky.onrender.com/api/admin/login";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return alert("Please enter both username and password");
    }

    try {
      const res = await axios.post(API_BASE, { username, password });

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);

      // Navigate to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Try again!";
      alert(message);
      console.error(err);
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
          className="bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
