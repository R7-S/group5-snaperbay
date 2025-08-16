// src/api/image.js
const BASE_URL = "https://pixabay.com/api/";
const API_KEY = process.env.REACT_APP_PIXABAY_API_KEY || "";

async function request(params) {
  if (!API_KEY) {
    throw new Error("Missing CRA env: REACT_APP_PIXABAY_API_KEY");
  }

  const url = new URL(BASE_URL);
  url.search = new URLSearchParams({
    key: API_KEY,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: "60",
    ...params,
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Pixabay error ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data?.hits)) throw new Error("Unexpected response shape");
  return data.hits;
}

export async function fetchLatestImages() {
  return request({ order: "latest" });
}

export async function fetchImagesByQuery(query) {
  return request({ q: query, order: "popular" });
}

export async function fetchImageById(id) {
  const hits = await request({ id });
  return hits[0] || null;
}
