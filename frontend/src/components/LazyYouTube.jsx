import React, { useState } from "react";

const LazyYouTube = ({ videoId }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = () => {
    setIsLoaded(true);
  };

  // YouTube thumbnail URL - use maxresdefault for 16:9 ratio (better quality, no black bars)
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full max-w-4xl mx-auto cursor-pointer aspect-video">
      {!isLoaded ? (
        <div onClick={handleClick} className="relative w-full h-full">
          <img
            src={thumbnail}
            alt="Video demo thumbnail"
            className="w-full h-full rounded-xl shadow-xl object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-full p-4">
              {/* Play icon */}
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 4l10 6-10 6V4z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <iframe
        className="w-full aspect-video rounded-xl shadow-xl border-0"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        title="Demo Video"
        />
      )}
    </div>
  );
};

export default LazyYouTube;
