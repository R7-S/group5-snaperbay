import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchImageById } from "../../api/image";

export default function ImageDetail() {
  const { id } = useParams();
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchImageById(id).then(setImage);
  }, [id]);

  if (!image) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <Link to="/" className="text-blue-500 underline">
        ← Back to Home
      </Link>
      <img
        src={image.largeImageURL}
        alt={image.tags}
        className="rounded mt-4"
      />
      <h2 className="text-2xl mt-4 font-semibold">{image.tags}</h2>
      <p className="mt-2">Views: {image.views}</p>
      <p>Downloads: {image.downloads}</p>
      <p>Likes: {image.likes}</p>
      <p className="mt-2">
        Photo by:{" "}
        <a
          href={`https://pixabay.com/users/${image.user}-${image.user_id}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {image.user}
        </a>
      </p>
    </div>
  );
}
