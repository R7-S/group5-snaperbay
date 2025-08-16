import { useState } from "react";

export default function BlurImage({
  lowSrc,
  src,
  alt,
  className = "",
  fit = "cover",
  showLoader = true,
}) {
  const [loaded, setLoaded] = useState(false);
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div className={`relative ${className}`}>
      <img
        src={lowSrc}
        alt={alt}
        className={`w-full h-full ${fitClass} ${
          loaded ? "opacity-0" : "opacity-100 blur-md"
        } transition`}
      />
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full absolute inset-0 ${fitClass} ${
          loaded ? "opacity-100" : "opacity-0"
        } transition duration-500`}
      />

      {showLoader && !loaded && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-slate-400/80 dark:border-slate-300/70 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
