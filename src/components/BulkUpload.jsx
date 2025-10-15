import React, { useState } from "react";
import api from "../api"; // centralized Axios instance

export default function BulkUpload({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); // clear previous messages
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file first!");
      return;
    }

    if (!localStorage.getItem("token")) {
      alert("Please login as admin first!");
      window.location.href = "/admin/login";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      const res = await api.post("/admin/tests/bulk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message);
      setFile(null);

      // Reset file input manually
      const input = document.getElementById("bulkFileInput");
      if (input) input.value = "";

      // Optional callback to refresh test list
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
        return;
      }

      setMessage(error.response?.data?.message || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">📤 Bulk Upload Tests</h2>
      <input
        type="file"
        id="bulkFileInput"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Uploading..." : "Upload File"}
      </button>
      {message && (
        <p
          className={`text-center font-semibold ${
            message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
