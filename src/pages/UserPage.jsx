


// src/pages/UserPage.jsx
import { useState, useEffect } from "react";
import api, { USER_TESTS } from "../api";

export default function UserPage() {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");

  const fetchTests = async () => {
    try {
      const res = await api.get(USER_TESTS); // using api.js
      setTests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const filteredTests = tests.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scan4health Test</h1>

      <input
        type="text"
        placeholder="Search by test name..."
        className="border p-2 w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredTests.length === 0 ? (
        <p>No tests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTests.map((t) => (
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
