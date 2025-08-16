import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";

import { fetchPopularImages, fetchImagesByQuery } from "../api/image";
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
import { FiZap, FiImage, FiMoon, FiTarget } from "react-icons/fi";
import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  TbTrees,
  TbBuildingSkyscraper,
  TbToolsKitchen2,
  TbCpu,
  TbUsers,
  TbPaw,
} from "react-icons/tb";

const CACHE_KEY_IMAGES = "snaperbay.images";
const CACHE_KEY_QUERY = "snaperbay.query";
const SEARCH_DEBOUNCE_MS = 450;
const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.03 },
  }),
};

export default function Home() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true); // initial load
  const [searching, setSearching] = useState(false); // live search
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const skeletons = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        h: Math.floor(Math.random() * 160) + 180,
      })),
    []
  );

  // categories you like (click to filter)
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

  // ---- Restore from cache instantly, then refresh in background
  useEffect(() => {
    let mounted = true;
    const cachedImages = sessionStorage.getItem(CACHE_KEY_IMAGES);
    const cachedQuery = sessionStorage.getItem(CACHE_KEY_QUERY);

    if (cachedImages) {
      try {
        const parsed = JSON.parse(cachedImages);
        if (Array.isArray(parsed)) {
          setImages(parsed);
          setQuery(cachedQuery || "");
          setLoading(false);
          (async () => {
            try {
              const data = (cachedQuery || "").trim()
                ? await fetchImagesByQuery(cachedQuery)
                : await fetchPopularImages();
              if (mounted) setImages(data);
            } catch (e) {
              if (mounted) setError(e.message || "Failed to refresh images.");
            }
          })();
          return () => {
            mounted = false;
          };
        }
      } catch {}
    }

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchPopularImages();
        if (mounted) setImages(data);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load images.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Persist cache
  useEffect(() => {
    try {
      sessionStorage.setItem(CACHE_KEY_IMAGES, JSON.stringify(images));
      sessionStorage.setItem(CACHE_KEY_QUERY, query);
    } catch {}
  }, [images, query]);

  // ---- LIVE SEARCH (debounced)
  const seqRef = useRef(0);
  const firstRunRef = useRef(true);
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    const currentSeq = ++seqRef.current;
    setSearching(true);
    setError("");
    const t = setTimeout(async () => {
      try {
        const q = query.trim();
        const data = q
          ? await fetchImagesByQuery(q)
          : await fetchPopularImages();
        if (seqRef.current === currentSeq) setImages(data);
      } catch (e) {
        if (seqRef.current === currentSeq)
          setError(e.message || "Search failed. Please try again.");
      } finally {
        if (seqRef.current === currentSeq) setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setError("");
  };
  const quickPick = (q) => setQuery(q); // clicking category fills input → triggers live search

  const showSkeleton = loading && images.length === 0;

  return (
    <div className="relative px-4">
      {!lowPower && (
        <div className="hidden md:block opacity-15 dark:opacity-25">
          <ScrollParallaxDecor />
        </div>
      )}

      {/* Fixed Search Bar (live) */}
      <div className="fixed left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-3 py-2 top-24 sm:top-28 flex items-center gap-2 bg-white/20 dark:bg-gray-900/40 backdrop-blur-lg rounded-full shadow-lg border border-white/20">
        <input
          type="text"
          placeholder="Search for images…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 bg-transparent text-lg text-black dark:text-white placeholder-white dark:placeholder-white focus:outline-none"
          aria-label="Search for images"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-500 rounded-full transition"
            aria-label="Clear search"
            title="Clear"
          >
            <IoClose size={22} />
          </button>
        )}
        {searching && (
          <div className="pr-2">
            <Loader size={18} />
          </div>
        )}
      </div>

      {/* Banner */}
      <div className="pt-40 sm:pt-44">
        <MotionReveal as="section">
          {/* make a local stacking context for the spot */}
          <div className="relative isolate">
            {/* contrast halo behind the hero copy – stays put */}
            <ReadableSpot className="z-0" />

            <ParallaxHover range={6}>
              {/* ensure text is above the spot */}
              <div className="relative z-10">
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center">
                  Discover stunning visuals
                  <span className="block text-lg sm:text-xl mt-2 font-normal text-slate-600 dark:text-slate-300">
                    Explore popular shots or search by keywords
                  </span>
                </h1>
              </div>
            </ParallaxHover>

            {/* helper chips */}
            <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-2">
              {["mountains", "food", "architecture", "flowers"].map((q) => (
                <button
                  key={q}
                  onClick={() => quickPick(q)}
                  className="px-3 py-1.5 rounded-full text-sm bg-white/70 dark:bg-slate-800/70 ring-1 ring-slate-200/70 dark:ring-slate-700 hover:translate-y-[-1px] transition"
                >
                  Try “{q}”
                </button>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* Info section */}
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

      {/* Category section */}
      <section className="mt-12 [content-visibility:auto] [contain-intrinsic-size:1px_560px]">
        <SectionHeading
          title="Browse by category"
          subtitle="Jump straight into what you like"
        />
        <div className="mt-4 flex justify-center">
          <CategoryChips items={categories} onPick={quickPick} />
        </div>
      </section>

      {/* Error */}
      {error && (
        <MotionReveal as="section" y={8}>
          <div className="mx-auto max-w-2xl mt-6 rounded-xl border border-red-200/40 dark:border-red-900/40 bg-red-50/60 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-200">
            {error}
          </div>
        </MotionReveal>
      )}

      {/* Trending / Results grid */}
      <MotionReveal as="section" delay={0.05} forceOnMount>
        <SectionHeading
          className="mt-10"
          title={query ? `Results for “${query}”` : "Trending now"}
        />
        <LazyMotion features={domAnimation}>
          {showSkeleton ? (
            <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4">
              {skeletons.map((s) => (
                <div key={s.id} className="mb-4 break-inside-avoid">
                  <Skeleton className="w-full" style={{ height: s.h }} />
                </div>
              ))}
            </div>
          ) : (
            <motion.ul
              className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]"
              transition={{
                layout: { type: "spring", stiffness: 200, damping: 24 },
              }}
            >
              {images.map((img, idx) => (
                <motion.li
                  key={img.id}
                  custom={idx}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  className="mb-4 break-inside-avoid"
                >
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02, rotateZ: -0.15 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      mass: 0.6,
                    }}
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
                          <div className="flex items-center justify-between text-sm">
                            <span className="truncate">by {img.user}</span>
                            <span className="opacity-70">{img.likes} ❤</span>
                          </div>
                        }
                      />
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </LazyMotion>
      </MotionReveal>

      {/* Lightbox Quick View */}
      <Lightbox open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl overflow-hidden ring-1 ring-slate-200/60 dark:ring-slate-800">
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center
               rounded-full bg-black/70 text-white hover:bg-black/85
               focus:outline-none focus:ring-2 focus:ring-white/70"
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
                showLoader={true}
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
                  className="px-4 py-2 rounded-xl ring-1 ring-slate-200 dark:ring-slate-700"
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
