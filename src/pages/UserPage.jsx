import { useState, useEffect } from "react";
import api from "../api"; // your centralized Axios instance

export default function UserPage() {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tests from backend
  const fetchTests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tests"); // token automatically included if needed
      setTests(res.data);
    } catch (err) {
      console.error("Error fetching tests:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch tests. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Filter tests by search input
  const filteredTests = tests.filter((t) =>
    t.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        SCAN4HEALTH PRICE TEST APP
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by test name..."
          className="w-full border border-gray-300 p-2 sm:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="text-center text-gray-600">Loading tests...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        filteredTests.length === 0 ? (
          <p className="text-center text-gray-600">No tests found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTests.map((t) => (
              <div
                key={t._id}
                className="border rounded-xl shadow-sm p-4 sm:p-5 bg-white hover:shadow-md transition"
              >
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
                  {t.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-700">
                  <span className="font-medium">Domestic Price:</span> ₹{t.domesticPrice}
                </p>
                <p className="text-sm sm:text-base text-gray-700">
                  <span className="font-medium">International Price:</span> ₹{t.internationalPrice}
                </p>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  <span className="font-medium">Precautions:</span> {t.precautions || "None"}
                </p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
