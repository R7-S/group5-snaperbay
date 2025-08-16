
import React from "react";

export default function HoverBlurEffect({ imageUrl, photographer }) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg group">
      <img
        src={imageUrl}
        alt={photographer || "Image"}
        className="w-full h-auto object-cover transition duration-300 ease-in-out group-hover:blur-sm"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
        <p className="text-white text-sm sm:text-base px-2 text-center">
          {photographer || "Unknown Photographer"}
        </p>
      </div>
    </div>
  );
}
