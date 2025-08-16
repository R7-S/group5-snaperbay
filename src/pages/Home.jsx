// Contributors: <Your Name> (live search, paginated grid, lightbox)

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  TbTrees,
  TbBuildingSkyscraper,
  TbToolsKitchen2,
  TbCpu,
  TbUsers,
  TbPaw,
} from "react-icons/tb";
import { FiZap, FiImage, FiMoon, FiTarget } from "react-icons/fi";

import { fetchLatestImages, fetchImagesByQuery } from "../api/image";
import MotionReveal from "../components/ui/MotionReveal";
import ParallaxHover from "../components/ui/ParallaxHover";
import ImageCard from "../components/ImageCard";
import Lightbox from "../components/ui/Lightbox";
import BlurImage from "../components/ui/BlurImage";
import Loader from "../components/ui/Loader";
import Skeleton from "../components/ui/Skeleton";
import SectionHeading from "../components/ui/SectionHeading";
import FeatureCard from "../components/FeatureCard";
import CategoryChips from "../components/CategoryChips";
import ScrollParallaxDecor from "../components/ui/ScrollParallaxDecor";
import ReadableSpot from "../components/ui/ReadableSpot";

const CACHE_KEY_IMAGES = "snaperbay.images";
const CACHE_KEY_QUERY = "snaperbay.query";

const PER_PAGE = 24;
const SEARCH_DEBOUNCE_MS = 450;
const lowPower = (navigator.hardwareConcurrency || 8) <= 4;

// tiny debounce hook
function useDebounced(value, delay) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.03 },
  }),
};

// simple, accessible pagination (with smart ellipses)
function Pagination({ page, totalPages, onChange }) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const items = (() => {
    if (totalPages <= 7) return range(1, totalPages);
    if (page <= 4) return [...range(1, 5), "…", totalPages];
    if (page >= totalPages - 3)
      return [1, "…", ...range(totalPages - 4, totalPages)];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  })();

  const baseBtn =
    "min-w-9 h-9 px-3 inline-flex items-center justify-center rounded-lg text-sm ring-1 transition " +
    "ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 " +
    "hover:bg-slate-50 dark:hover:bg-slate-700";
  const active =
    "bg-slate-900 text-white bg-black dark:bg-white dark:text-slate-900 ring-slate-900/10 dark:ring-white/20";

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <button
        className={`${baseBtn} mr-1`}
        disabled={!hasPrev}
        onClick={() => hasPrev && onChange(page - 1)}
        aria-label="Previous page"
      >
        Prev
      </button>
      {items.map((it, idx) =>
        it === "…" ? (
          <span
            key={`e${idx}`}
            className="px-2 select-none text-slate-500 dark:text-slate-400"
          >
            …
          </span>
        ) : (
          <button
            key={it}
            className={`${baseBtn} ${it === page ? active : ""}`}
            aria-current={it === page ? "page" : undefined}
            onClick={() => onChange(it)}
          >
            {it}
          </button>
        )
      )}
      <button
        className={`${baseBtn} ml-1`}
        disabled={!hasNext}
        onClick={() => hasNext && onChange(page + 1)}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}

export default function Home() {
  // search
  const [queryInput, setQueryInput] = useState("");
  const debouncedQuery = useDebounced(queryInput, SEARCH_DEBOUNCE_MS);

  // data & pagination
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);

  // ui state
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  // categories (react-icons)
  const categories = [
    {
      key: "nature",
      label: "Nature",
      query: "nature landscape",
      icon: <TbTrees />,
    },
    {
      key: "city",
      label: "City",
      query: "city skyline",
      icon: <TbBuildingSkyscraper />,
    },
    {
      key: "food",
      label: "Food",
      query: "food delicious",
      icon: <TbToolsKitchen2 />,
    },
    {
      key: "tech",
      label: "Tech",
      query: "technology gadgets",
      icon: <TbCpu />,
    },
    {
      key: "people",
      label: "People",
      query: "people portrait",
      icon: <TbUsers />,
    },
    {
      key: "animals",
      label: "Animals",
      query: "animals wildlife",
      icon: <TbPaw />,
    },
  ];

  // restore from cache on mount
  useEffect(() => {
    const cachedImages = sessionStorage.getItem(CACHE_KEY_IMAGES);
    const cachedQuery = sessionStorage.getItem(CACHE_KEY_QUERY);
    if (cachedImages) {
      try {
        const parsed = JSON.parse(cachedImages);
        if (Array.isArray(parsed) && parsed.length) {
          setImages(parsed);
          setQueryInput(cachedQuery || "");
          setInitialLoading(false);
          return;
        }
      } catch {}
    }
  }, []);

  // scroll back to top of results on page/query change (not on first mount)
  const resultsTopRef = useRef(null);
  useEffect(() => {
    if (!initialLoading) {
      resultsTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page, debouncedQuery, initialLoading]);

  // fetch whenever debounced query or page changes
  useEffect(() => {
    const abort = new AbortController();
    async function run() {
      setError("");
      setIsFetching(true);
      try {
        const params = { page, perPage: PER_PAGE };
        const q = debouncedQuery.trim();

        const { hits, totalHits: tHits } = q
          ? await fetchImagesByQuery(q, params, abort.signal)
          : await fetchLatestImages(params, abort.signal);

        setTotalHits(tHits || 0);
        setImages(hits);

        // cache only first page of current query to keep it light
        if (page === 1) {
          sessionStorage.setItem(CACHE_KEY_IMAGES, JSON.stringify(hits));
          sessionStorage.setItem(CACHE_KEY_QUERY, q);
        }
      } catch (e) {
        if (e.name !== "AbortError")
          setError(e.message || "Failed to fetch images.");
      } finally {
        setInitialLoading(false);
        setIsFetching(false);
      }
    }
    run();
    return () => abort.abort();
  }, [debouncedQuery, page]);

  // when typing a new query: reset to page 1
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const totalPages = Math.max(1, Math.ceil(totalHits / PER_PAGE));
  const pageStart = totalHits === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const pageEnd = Math.min(totalHits, page * PER_PAGE);

  const skeletonHeights = useMemo(
    () => ["h-44", "h-52", "h-60", "h-72", "h-64", "h-56", "h-48", "h-80"],
    []
  );

  // helpers
  const quickPick = (q) => setQueryInput(q);
  const clearQuery = () => {
    setQueryInput("");
    setError("");
  };

  const showSkeleton =
    (initialLoading && images.length === 0) ||
    (isFetching && images.length === 0);

  return (
    <div className="relative px-4">
      {!lowPower && (
        <div className="hidden md:block opacity-15 dark:opacity-25">
          <ScrollParallaxDecor />
        </div>
      )}

      <div
        className="fixed left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-3 py-2 top-24 sm:top-28
                      flex items-center gap-2 bg-white/20 dark:bg-gray-900/40 backdrop-blur-lg
                      rounded-full shadow-lg border border-white/20"
      >
        <input
          type="text"
          placeholder="Search for images…"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          className="flex-grow px-4 py-2 bg-transparent text-lg text-slate-900 dark:text-slate-100
                     placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
          aria-label="Search for images"
          autoComplete="off"
        />
        {queryInput && (
          <button
            onClick={clearQuery}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-500 rounded-full transition"
            aria-label="Clear search"
            title="Clear"
          >
            <IoClose size={22} />
          </button>
        )}
        {isFetching && page === 1 && (
          <div className="pr-2">
            <Loader size={18} />
          </div>
        )}
      </div>

      <div className="pt-40 sm:pt-44">
        <MotionReveal as="section">
          <div className="relative isolate">
            <ReadableSpot className="z-0" />
            <ParallaxHover range={6}>
              <div className="relative z-10">
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center text-slate-900 dark:text-slate-100">
                  Discover stunning visuals
                  <span className="block text-lg sm:text-xl mt-2 font-normal text-slate-600 dark:text-slate-300">
                    Explore popular shots or search by keywords
                  </span>
                </h1>
              </div>
            </ParallaxHover>
            <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-2">
              {["mountains", "food", "architecture", "flowers"].map((q) => (
                <button
                  key={q}
                  onClick={() => quickPick(q)}
                  className="px-3 py-1.5 rounded-full text-sm bg-white/70 dark:bg-slate-800/70
                             ring-1 ring-slate-200/70 dark:ring-slate-700 hover:translate-y-[-1px]
                             transition text-slate-800 dark:text-slate-100"
                >
                  Try “{q}”
                </button>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* Info */}
      <section className="mt-12 [content-visibility:auto] [contain-intrinsic-size:1px_640px]">
        <SectionHeading
          title="Why Snaperbay?"
          subtitle="Fast, elegant, and built for discovery"
        />
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={<FiZap />}
            title="Instant results"
            desc="Live search with smooth transitions and no jank."
          />
          <FeatureCard
            icon={<FiImage />}
            title="Quality images"
            desc="Curated photos from Pixabay with rich details."
          />
          <FeatureCard
            icon={<FiMoon />}
            title="Theme-aware"
            desc="Polished in both light and dark modes."
          />
          <FeatureCard
            icon={<FiTarget />}
            title="Focused UX"
            desc="Keyboard-friendly, accessible, and responsive."
          />
        </div>
      </section>

      <section className="mt-12 [content-visibility:auto] [contain-intrinsic-size:1px_560px]">
        <SectionHeading
          title="Browse by category"
          subtitle="Jump straight into what you like"
        />
        <div className="mt-4 flex justify-center">
          <CategoryChips items={categories} onPick={quickPick} />
        </div>
      </section>

      {error && (
        <MotionReveal as="section" y={8}>
          <div
            className="mx-auto max-w-2xl mt-6 rounded-xl border border-red-200/40 dark:border-red-900/40
                          bg-red-50/60 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-200"
          >
            {error}
          </div>
        </MotionReveal>
      )}

      <MotionReveal as="section" delay={0.05} forceOnMount>
        <div ref={resultsTopRef} />
        <SectionHeading
          className="mt-10"
          title={
            debouncedQuery ? `Results for “${debouncedQuery}”` : "Trending now"
          }
          subtitle={
            isFetching && images.length === 0
              ? "Loading…"
              : totalHits
              ? `Showing ${pageStart}–${pageEnd} of ${totalHits.toLocaleString()}`
              : "No results yet"
          }
        />
        <LazyMotion features={domAnimation}>
          {showSkeleton ? (
            <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="mb-4 break-inside-avoid">
                  <Skeleton className={`w-full ${skeletonHeights[i % 8]}`} />
                </div>
              ))}
            </div>
          ) : (
            <>
              <m.ul className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
                {images.map((img, idx) => (
                  <m.li
                    key={img.id}
                    custom={idx}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={lowPower ? undefined : itemVariants}
                    className="mb-4 break-inside-avoid"
                  >
                    <div
                      className="group transform-gpu will-change-transform transition duration-300 ease-out
                                    hover:-translate-y-1.5 hover:scale-[1.015]"
                    >
                      <Link
                        to={`/images/${img.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelected(img);
                        }}
                      >
                        <ImageCard
                          src={img.webformatURL}
                          alt={img.tags}
                          footer={
                            <div className="flex items-center justify-between text-sm text-slate-800 dark:text-slate-100">
                              <span className="truncate">by {img.user}</span>
                              <span className="opacity-70">{img.likes} ❤</span>
                            </div>
                          }
                        />
                      </Link>
                    </div>
                  </m.li>
                ))}
              </m.ul>

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </>
          )}
        </LazyMotion>
      </MotionReveal>

      <Lightbox open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div
            className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100
                          rounded-2xl overflow-hidden ring-1 ring-slate-200/60 dark:ring-slate-800"
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center
                         rounded-full bg-black/70 text-white hover:bg-black/85 focus:outline-none focus:ring-2
                         focus:ring-white/70"
            >
              <IoClose size={18} />
            </button>
            <div className="w-full max-w-screen-lg mx-auto">
              <BlurImage
                lowSrc={selected.previewURL}
                src={selected.largeImageURL || selected.webformatURL}
                alt={selected.tags}
                className="w-full h-[60vh] sm:h-[70vh] max-h-[calc(100vh-7rem)]"
                fit="contain"
                showLoader
              />
            </div>
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="text-base font-medium">
                  {selected.tags || "Image"}
                </div>
                <div className="text-sm opacity-80">by {selected.user}</div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to={`/images/${selected.id}`}
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 text-slate-800 dark:text-slate-100"
                >
                  Open details
                </Link>
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Lightbox>
    </div>
  );
}
