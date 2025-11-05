// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import api, { ADMIN_TESTS, DELETE_ALL_TESTS } from "../api";

import BulkUpload from "../components/BulkUpload.jsx";


export default function AdminDashboard() {
  const [tests, setTests] = useState([]);
  const [editTestId, setEditTestId] = useState(null);
  const [name, setName] = useState("");
  const [domesticPrice, setDomesticPrice] = useState("");
  const [internationalPrice, setInternationalPrice] = useState("");
  const [precautions, setPrecautions] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // -------------------- Fetch Tests --------------------
  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await api.get(ADMIN_TESTS);
      setTests(res.data);
    } catch (err) {
      console.error("Error fetching tests:", err);
      setMessage(err.response?.data?.message || "Error fetching tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // -------------------- Save Test (Add / Update) --------------------
  const saveTest = async () => {
    if (!name || !domesticPrice || !internationalPrice) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      name,
      domesticPrice: Number(domesticPrice),
      internationalPrice: Number(internationalPrice),
      precautions,
    };

    try {
      setLoading(true);
      setMessage("");

      if (editTestId) {
        await api.put(`${ADMIN_TESTS}/${editTestId}`, payload);
        setMessage("Test updated successfully!");
      } else {
        await api.post(ADMIN_TESTS, payload);
        setMessage("Test added successfully!");
      }

      resetForm();
      fetchTests();
    } catch (err) {
      console.error("Error saving test:", err);
      setMessage(err.response?.data?.message || "Error saving test");
    } finally {
      setLoading(false);
    }
  };



  // -------------------- Edit Test --------------------
  const editTest = (t) => {
    setEditTestId(t._id);
    setName(t.name);
    setDomesticPrice(t.domesticPrice);
    setInternationalPrice(t.internationalPrice);
    setPrecautions(t.precautions);
    setMessage("");
  };

  // -------------------- Delete Test --------------------
  const deleteTest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      setLoading(true);
      await api.delete(`${ADMIN_TESTS}/${id}`);
      setMessage("Test deleted successfully!");
      fetchTests();
    } catch (err) {
      console.error("Error deleting test:", err);
      setMessage(err.response?.data?.message || "Error deleting test");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Reset Form --------------------
  const resetForm = () => {
    setEditTestId(null);
    setName("");
    setDomesticPrice("");
    setInternationalPrice("");
    setPrecautions("");
    setMessage("");
  };


  // Delete all tests
const deleteAllTests = async () => {
  if (!window.confirm("⚠️ This will delete ALL tests. Continue?")) return;

  try {
    setLoading(true);
  api.delete("/tests/all")


  // ✅ force correct route

    setMessage("✅ All tests deleted successfully!");
    fetchTests();
  } catch (err) {
    setMessage(err.response?.data?.message || "Error deleting all tests");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Message */}
      {message && (
        <p
          className={`mb-4 font-semibold ${
            message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}


    {/* Bulk Upload */}
    <div className="mb-6">
      <BulkUpload />
    </div>

      {/* Add / Edit Test */}
      <div className="mb-6 flex flex-col gap-2 border p-4 rounded">
        <input
          placeholder="Name"
          className="border p-2"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Domestic Price"
          className="border p-2"
          type="number"
          value={domesticPrice || ""}
          onChange={(e) => setDomesticPrice(e.target.value)}
        />
        <input
          placeholder="International Price"
          className="border p-2"
          type="number"
          value={internationalPrice || ""}
          onChange={(e) => setInternationalPrice(e.target.value)}
        />
        <input
          placeholder="Precautions"
          className="border p-2"
          value={precautions || ""}
          onChange={(e) => setPrecautions(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={saveTest}
            disabled={loading}
          >
            {loading ? "Saving..." : editTestId ? "Update Test" : "Add Test"}
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={resetForm}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Test List */}
      <div className="flex justify-between items-center mb-2">
  <h2 className="text-xl font-semibold">Existing Tests</h2>

  <button
    className="bg-red-600 text-white px-3 py-1 rounded"
    onClick={deleteAllTests}
    disabled={loading}
  >
    {loading ? "Deleting..." : "Delete All"}
  </button>
</div>

      {loading && tests.length === 0 ? (
        <p>Loading tests...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {tests.map((t) => (
            <div
              key={t._id}
              className="border p-2 flex justify-between items-center"
            >
              <div>
                <strong>{t.name}</strong> | ₹{t.domesticPrice} | ₹
                {t.internationalPrice} | {t.precautions}
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => editTest(t)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteTest(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
