import React from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MediaImage = ({uuid, fileType, altText, className="w-full h-auto object-cover"}) => {
    const imageUrl = `${BACKEND_URL}/proxy/media/${uuid}${fileType ? '?fileType=' + encodeURIComponent(fileType) : ''}`;
    // console.log("Image URL:", imageUrl);
    return (
        <img
        src={imageUrl}
        alt={altText || "Media Image"}
        onError={(e) => { e.target.src = '/images/404.jpg'; }}
        className={className}
        loading="lazy"
      />
    )
};

export default MediaImage;