// Contributors: Rahul Sasidharan Nair ,8992754

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = process.env.REACT_APP_PIXABAY_API_KEY || "";

function buildUrl(params) {
  const u = new URL(BASE_URL);
  u.searchParams.set("key", API_KEY);
  u.searchParams.set("image_type", "photo");
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, v);
  });
  return u.toString();
}

async function fetchPixabay(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return {
    hits: Array.isArray(data.hits) ? data.hits : [],
    total: data.total ?? 0,
    totalHits: data.totalHits ?? 0,
  };
}

async function request(params, signal) {
  if (!API_KEY) throw new Error("Missing CRA env: REACT_APP_PIXABAY_API_KEY");

  const url = new URL(BASE_URL);
  url.search = new URLSearchParams({
    key: API_KEY,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: "60",
    ...params,
  });

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Pixabay error ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data?.hits)) throw new Error("Unexpected response shape");
  return data.hits;
}

export async function fetchLatestImages(
  { page = 1, perPage = 10 } = {},
  signal
) {
  const url = buildUrl({ order: "latest", per_page: perPage, page });
  return fetchPixabay(url, signal);
}

export async function fetchImagesByQuery(
  query,
  { page = 1, perPage = 10 } = {},
  signal
) {
  const url = buildUrl({
    q: encodeURIComponent(query),
    per_page: perPage,
    page,
  });
  return fetchPixabay(url, signal);
}

export async function fetchImageById(id, signal) {
  const hits = await request({ id }, signal);
  return hits[0] || null;
}
