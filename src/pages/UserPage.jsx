
import { useState, useEffect } from "react";
import api, { USER_TESTS, SEARCH_TESTS } from "../api";

export default function UserPage() {
  const [tests, setTests] = useState([]);
  const [originalTests, setOriginalTests] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all tests initially
  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await api.get(USER_TESTS);
      setTests(res.data);
      setOriginalTests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Backend search
  const searchTests = async (query) => {
    if (!query) return fetchTests();

    try {
      const res = await api.get(`${SEARCH_TESTS}?q=${query}`);
      setTests(res.data);
      setSuggestions(res.data.slice(0, 5)); // show top 5 suggestions
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Instant + backend suggestion search
  useEffect(() => {
    const query = search.toLowerCase();
    const localFiltered = originalTests.filter((t) =>
      t.name.toLowerCase().includes(query)
    );
    setTests(localFiltered);
    setSuggestions(localFiltered.slice(0, 5));

    const debounce = setTimeout(() => {
      if (search) searchTests(search);
    }, 200);

    return () => clearTimeout(debounce);
  }, [search]);

  const handleSuggestionClick = (text) => {
    setSearch(text);
    setSuggestions([]);
    searchTests(text);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">Scan4health Test</h1>

      <div className="relative">
        <input
          type="text"
          placeholder="Search by test name..."
          className="border p-2 w-full rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search && setSuggestions(tests.slice(0, 5))}
        />

        {/* Suggestion Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute bg-white border shadow w-full mt-1 rounded z-50">
            {suggestions.map((s) => (
              <div
                key={s._id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSuggestionClick(s.name)}
              >
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {tests.length === 0 && !loading ? (
        <p className="mt-4">No tests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {tests.map((t) => (
            <div key={t._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{t.name}</h2>
              <p>Domestic Price: ₹{t.domesticPrice}</p>
              <p>International Price: ₹{t.internationalPrice}</p>
              <p>Precautions: {t.precautions}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
