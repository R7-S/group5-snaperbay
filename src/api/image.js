const API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;
const BASE_URL = "https://pixabay.com/api/";

export async function fetchPopularImages() {
  try {
    const res = await fetch(
      `${BASE_URL}?key=${API_KEY}&image_type=photo&order=popular&per_page=12`
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.hits;
  } catch (err) {
    console.error("Error fetching popular images:", err);
    return [];
  }
}

export async function fetchImagesByQuery(query) {
  try {
    const res = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
        query
      )}&image_type=photo&per_page=12`
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.hits;
  } catch (err) {
    console.error("Error fetching searched images:", err);
    return [];
  }
}

export async function fetchImageById(id) {
  try {
    const res = await fetch(`${BASE_URL}?key=${API_KEY}&id=${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.hits[0] || null;
  } catch (err) {
    console.error("Error fetching image by ID:", err);
    return null;
  }
}
