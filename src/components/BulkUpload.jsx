
// src/pages/BulkUpload.jsx
import React, { useState } from "react";
import api, { ADMIN_TESTS_BULK } from "../api";

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file first!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login as admin first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      const res = await api.post(ADMIN_TESTS_BULK, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // token already added by api.js interceptor
        },
      });

      setMessage(res.data.message);
      setFile(null);
    } catch (error) {
      console.error(error);
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
            message.toLowerCase().includes("successfully")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

