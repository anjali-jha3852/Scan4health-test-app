import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { ADMIN_LOGIN } from "../api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(ADMIN_LOGIN, { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input
          placeholder="Username"
          className="border p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">
          Login
        </button>
      </form>
    </div>
  );
}
