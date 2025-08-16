// src/pages/images/[id].jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoArrowBackOutline,
  IoDownloadOutline,
  IoShareSocialOutline,
  IoLinkOutline,
  IoOpenOutline,
  IoEyeOutline,
  IoHeartOutline,
  IoImageOutline,
} from "react-icons/io5";

import { fetchImageById, fetchImagesByQuery } from "../../api/image";
import PageTransition from "../../components/ui/PageTransition";
import BlurImage from "../../components/ui/BlurImage";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import SectionHeading from "../../components/ui/SectionHeading";
import AnimatedTabs from "../../components/ui/AnimatedTabs";
import ScrollParallaxDecor from "../../components/ui/ScrollParallaxDecor";
import ImageCard from "../../components/ImageCard";
import Skeleton from "../../components/ui/Skeleton";

const fmt = (n) => new Intl.NumberFormat().format(n || 0);

function CountUp({ value, duration = 0.6 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = Number(value || 0);
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span aria-live="polite">{fmt(display)}</span>;
}

function Stat({ icon, label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
      className="rounded-xl px-3 py-2 ring-1 ring-slate-200/70 dark:ring-slate-800
                 bg-white/70 dark:bg-slate-900/60 backdrop-blur
                 text-slate-800 dark:text-slate-100"
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="opacity-80">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="mt-1 text-lg font-semibold">
        <CountUp value={value} />
      </div>
    </motion.div>
  );
}

export default function ImageDetail() {
  const { id } = useParams();
  const history = useHistory();

  const [image, setImage] = useState(null);
  const [copyHint, setCopyHint] = useState("Copy link");
  const [shareHint, setShareHint] = useState("Share");

  const [activeTab, setActiveTab] = useState("info");

  const [related, setRelated] = useState([]);
  const [authorPics, setAuthorPics] = useState([]);
  const [relLoading, setRelLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchImageById(id);
      if (mounted) setImage(data);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!image) return;

    const tagsArr = (image.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const tagQuery = tagsArr[0] || "";
    const authorQuery = (image.user || "").toString();

    let mounted = true;
    const acRelated = new AbortController();
    const acAuthor = new AbortController();

    (async () => {
      try {
        setRelLoading(true);
        if (!tagQuery) {
          if (mounted) setRelated([]);
          return;
        }
        const { hits: rHits = [] } = await fetchImagesByQuery(
          tagQuery,
          { page: 1, perPage: 24 },
          acRelated.signal
        );
        if (mounted) {
          setRelated(rHits.filter((x) => x.id !== image.id).slice(0, 9));
        }
      } finally {
        if (mounted) setRelLoading(false);
      }
    })();

    (async () => {
      try {
        setAuthLoading(true);
        if (!authorQuery) {
          if (mounted) setAuthorPics([]);
          return;
        }
        const { hits: aHits = [] } = await fetchImagesByQuery(
          authorQuery,
          { page: 1, perPage: 24 },
          acAuthor.signal
        );
        if (mounted) {
          setAuthorPics(aHits.filter((x) => x.id !== image.id).slice(0, 9));
        }
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();

    return () => {
      mounted = false;
      acRelated.abort();
      acAuthor.abort();
    };
  }, [image]);

  const tags = useMemo(
    () =>
      image?.tags
        ? image.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    [image]
  );

  if (!image) {
    return (
      <div className="px-4 py-16 grid place-items-center">
        <Loader size={36} />
      </div>
    );
  }

  const detailURL = image.pageURL || `https://pixabay.com/photos/${image.id}/`;
  const largeURL =
    image.largeImageURL || image.webformatURL || image.previewURL;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyHint("Copied!");
      setTimeout(() => setCopyHint("Copy link"), 1200);
    } catch {
      setCopyHint("Press Ctrl+C");
      setTimeout(() => setCopyHint("Copy link"), 1500);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: image.tags || "Image",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
      setShareHint("Shared!");
      setTimeout(() => setShareHint("Share"), 1200);
    } catch {}
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = largeURL;
    a.download = `snaperbay-${image.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <PageTransition className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <ScrollParallaxDecor />

      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          onClick={() => history.goBack()}
          className="inline-flex items-center gap-2 text-sm rounded-full px-3 py-1.5
                     bg-slate-100/70 dark:bg-white/10 hover:bg-slate-200/70 dark:hover:bg-white/15
                     text-slate-700 dark:text-slate-200 transition
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                     focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900"
        >
          <IoArrowBackOutline /> Back
        </button>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopy}
            className="rounded-full"
            aria-label="Copy link"
          >
            <IoLinkOutline className="mr-2" /> {copyHint}
          </Button>
          <Button
            onClick={handleShare}
            className="rounded-full"
            aria-label="Share"
          >
            <IoShareSocialOutline className="mr-2" /> {shareHint}
          </Button>
          <Button
            onClick={handleDownload}
            className="rounded-full"
            aria-label="Download image"
          >
            <IoDownloadOutline className="mr-2" /> Download
          </Button>
          <a
            href={detailURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                       ring-1 ring-slate-200/70 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                       focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900"
          >
            <IoOpenOutline /> Open on Pixabay
          </a>
        </div>
      </div>

      {/* layout: image (2) + sidebar (1) on desktop */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* image panel with Ken-Burns drift + shared-element morph */}
        <motion.div
          layoutId={`img-${image.id}`} // matches grid/lightbox if enabled
          className="lg:col-span-2 rounded-2xl overflow-hidden ring-1 ring-slate-200/60 dark:ring-slate-800
                     bg-gradient-to-b from-slate-50/60 to-white/20 dark:from-slate-900/30 dark:to-slate-900/10"
        >
          <motion.div
            initial={{ scale: 1, y: 0 }}
            whileInView={{ scale: 1.02, y: -4 }}
            viewport={{ amount: 0.6, once: false }}
            transition={{ duration: 8, ease: "linear" }}
          >
            <BlurImage
              lowSrc={image.previewURL}
              src={largeURL}
              alt={image.tags}
              className="w-full h-[52vh] sm:h-[64vh] lg:h-[70vh]"
              fit="contain"
              showLoader={true}
            />
          </motion.div>
        </motion.div>

        {/* sidebar / metadata with tabs */}
        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.45 } }}
          className="lg:sticky lg:top-24 h-max"
        >
          <div className="rounded-2xl p-4 ring-1 ring-slate-200/70 dark:ring-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur">
            {/* author */}
            <div className="flex items-center gap-3">
              <img
                src={
                  image.userImageURL ||
                  "https://i.pravatar.cc/80?u=" + image.user_id
                }
                alt={image.user}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200/70 dark:ring-slate-700"
              />
              <div>
                <div className="text-sm font-medium">{image.user}</div>
                <div className="text-xs opacity-70">Contributor</div>
              </div>
            </div>

            {/* title */}
            <h1 className="mt-4 text-xl font-semibold leading-tight">
              {image.tags || "Image"}
            </h1>

            {/* tabs */}
            <div className="mt-4">
              <AnimatedTabs
                tabs={[
                  { key: "info", label: "Info" },
                  { key: "meta", label: "Meta" },
                  { key: "license", label: "License" },
                ]}
                onChange={setActiveTab}
              />
            </div>

            {/* Accessible, persistent tab panels */}
            <div className="mt-4">
              {/* Info panel */}
              <motion.div
                key="tab-info"
                role="tabpanel"
                id="panel-info"
                aria-labelledby="tab-info"
                aria-hidden={activeTab !== "info"}
                hidden={activeTab !== "info"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 ring-1 ring-slate-200/70 dark:ring-slate-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Stat
                    icon={<IoEyeOutline />}
                    label="Views"
                    value={image.views}
                  />
                  <Stat
                    icon={<IoHeartOutline />}
                    label="Likes"
                    value={image.likes}
                  />
                  <Stat
                    icon={<IoImageOutline />}
                    label="Downloads"
                    value={image.downloads}
                  />
                </div>
              </motion.div>

              {/* Meta panel */}
              <motion.div
                key="tab-meta"
                role="tabpanel"
                id="panel-meta"
                aria-labelledby="tab-meta"
                aria-hidden={activeTab !== "meta"}
                hidden={activeTab !== "meta"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm leading-6 opacity-90"
              >
                <div>Type: {image.type || "Photo"}</div>
                {image.imageWidth && image.imageHeight && (
                  <div>
                    Dimensions: {fmt(image.imageWidth)} ×{" "}
                    {fmt(image.imageHeight)} px
                  </div>
                )}
                {image.size && <div>Size: {fmt(image.size)} KB</div>}
                <div>ID: {image.id}</div>
              </motion.div>

              {/* License panel */}
              <motion.div
                key="tab-license"
                role="tabpanel"
                id="panel-license"
                aria-labelledby="tab-license"
                aria-hidden={activeTab !== "license"}
                hidden={activeTab !== "license"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm leading-6 opacity-90"
              >
                <p>
                  Images are served from Pixabay. Please review the Pixabay
                  license and usage guidelines on the image page for up-to-date
                  terms.
                </p>
                <a
                  href={detailURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 underline text-blue-600
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                             focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900"
                >
                  View on Pixabay
                </a>
              </motion.div>
            </div>
          </div>
        </motion.aside>
      </div>

      <section className="mt-10">
        <SectionHeading
          title="More like this"
          subtitle="Similar vibes based on the first tag"
        />
        {relLoading ? (
          <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <Skeleton className="w-full h-48" />
              </div>
            ))}
          </div>
        ) : related.length === 0 ? (
          <p className="mt-6 text-center opacity-70">
            No similar images found.
          </p>
        ) : (
          <motion.ul
            className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]"
            transition={{
              layout: { type: "spring", stiffness: 200, damping: 24 },
            }}
          >
            {related.map((img) => (
              <li key={img.id} className="mb-4 break-inside-avoid">
                <Link
                  to={`/images/${img.id}`}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                             focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900 rounded-lg"
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
              </li>
            ))}
          </motion.ul>
        )}
      </section>

      {/* --- More by author --- */}
      <section className="mt-10">
        <SectionHeading
          title={`More by ${image.user}`}
          subtitle="Discover other work from this contributor"
        />
        {authLoading ? (
          <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <Skeleton className="w-full h-48" />
              </div>
            ))}
          </div>
        ) : authorPics.length === 0 ? (
          <p className="mt-6 text-center opacity-70">No other images found.</p>
        ) : (
          <motion.ul
            className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]"
            transition={{
              layout: { type: "spring", stiffness: 200, damping: 24 },
            }}
          >
            {authorPics.map((img) => (
              <li key={img.id} className="mb-4 break-inside-avoid">
                <Link
                  to={`/images/${img.id}`}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                             focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900 rounded-lg"
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
              </li>
            ))}
          </motion.ul>
        )}
      </section>
    </PageTransition>
  );
}
