
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://client-ylky.onrender.com/api"; // Live backend URL

export default function UserPage() {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // show loading while fetching
  const [error, setError] = useState("");

  // Fetch all tests on page load
  const fetchTests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tests`);
      setTests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tests. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Filter tests based on search input
  const filteredTests = tests.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        SCAN4HEALTH PRICE TEST APP
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by test name..."
          className="w-full border border-gray-300 p-2 sm:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-center text-gray-600">Loading tests...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Tests Grid */}
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
                  <span className="font-medium">Precautions:</span> {t.precautions}
                </p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
