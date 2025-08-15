import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPopularImages, fetchImagesByQuery } from "../api/image";

export default function Home() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Load popular images on page load
    fetchPopularImages().then(setImages);
  }, []);

  const handleSearch = () => {
    if (query.trim() === "") return;
    fetchImagesByQuery(query).then(setImages);
  };

  return (
    <div className="p-4">
      {/* Search bar */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Search for images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 
             focus:outline-none focus:ring-2 focus:ring-blue-500
             bg-white dark:bg-gray-700
             text-gray-900 dark:text-white
             placeholder-gray-500 dark:placeholder-gray-300"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <Link key={img.id} to={`/images/${img.id}`}>
            <img
              src={img.webformatURL}
              alt={img.tags}
              className="rounded shadow hover:scale-105 transition"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
