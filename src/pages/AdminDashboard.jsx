import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://client-ylky.onrender.com/api"; // Live backend URL

export default function AdminDashboard() {
  const [tests, setTests] = useState([]);
  const [editTestId, setEditTestId] = useState(null);
  const [name, setName] = useState("");
  const [domesticPrice, setDomesticPrice] = useState("");
  const [internationalPrice, setInternationalPrice] = useState("");
  const [precautions, setPrecautions] = useState("");
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch all tests
  const fetchTests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tests`);
      setTests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // -------------------- Bulk Upload --------------------
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleBulkUpload = async () => {
    if (!file) return alert("Please select an Excel file first!");
    if (!token) return alert("Please login as admin first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setUploadMessage("");
      const res = await axios.post(`${API_BASE}/admin/tests/bulk`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadMessage(res.data.message);
      setFile(null);
      fetchTests(); // refresh after upload
    } catch (err) {
      console.error(err);
      setUploadMessage(err.response?.data?.message || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Add / Update Test --------------------
  const saveTest = async () => {
    if (!token) return alert("Please login as admin first!");
    try {
      const payload = {
        name,
        domesticPrice: Number(domesticPrice),
        internationalPrice: Number(internationalPrice),
        precautions,
      };

      if (editTestId) {
        await axios.put(`${API_BASE}/admin/tests/${editTestId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE}/admin/tests`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchTests();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // -------------------- Edit & Delete --------------------
  const editTest = (test) => {
    setEditTestId(test._id);
    setName(test.name);
    setDomesticPrice(test.domesticPrice);
    setInternationalPrice(test.internationalPrice);
    setPrecautions(test.precautions);
  };

  const deleteTest = async (id) => {
    if (!token) return alert("Please login as admin first!");
    try {
      await axios.delete(`${API_BASE}/admin/tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTests();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setEditTestId(null);
    setName("");
    setDomesticPrice("");
    setInternationalPrice("");
    setPrecautions("");
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        🛠 Admin Dashboard
      </h1>

      {/* Bulk Upload */}
      <div className="mb-8 border rounded-lg bg-gray-50 p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-3">
          📤 Bulk Upload Tests
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleBulkUpload}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
        {uploadMessage && (
          <p
            className={`mt-2 font-semibold text-sm ${
              uploadMessage.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {uploadMessage}
          </p>
        )}
      </div>

      {/* Add / Edit Test */}
      <div className="mb-8 border rounded-lg p-4 sm:p-6 shadow-sm flex flex-col gap-3">
        <input
          placeholder="Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Domestic Price"
          className="border p-2 rounded"
          value={domesticPrice}
          onChange={(e) => setDomesticPrice(e.target.value)}
        />
        <input
          placeholder="International Price"
          className="border p-2 rounded"
          value={internationalPrice}
          onChange={(e) => setInternationalPrice(e.target.value)}
        />
        <input
          placeholder="Precautions"
          className="border p-2 rounded"
          value={precautions}
          onChange={(e) => setPrecautions(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={saveTest}
          >
            {editTestId ? "Update Test" : "Add Test"}
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Test List */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-3">
        🧪 Existing Tests
      </h2>
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[50vh]">
        {tests.length === 0 ? (
          <p className="text-gray-500 text-center">No tests found.</p>
        ) : (
          tests.map((t) => (
            <div
              key={t._id}
              className="border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-sm"
            >
              <div className="mb-2 sm:mb-0">
                <strong className="block text-gray-800">{t.name}</strong>
                <p className="text-sm text-gray-600">
                  ₹{t.domesticPrice} | ₹{t.internationalPrice}
                </p>
                <p className="text-xs text-gray-500">{t.precautions}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded w-full sm:w-auto"
                  onClick={() => editTest(t)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full sm:w-auto"
                  onClick={() => deleteTest(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
