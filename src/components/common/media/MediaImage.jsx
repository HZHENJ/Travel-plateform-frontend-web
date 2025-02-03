import React from "react";

// const BACKEND_URL = import.meta.env.BACKEND_URL;
const BACKEND_URL = "http://localhost:8080";

const MediaImage = ({uuid, fileType, altText}) => {
    const imageUrl = `${BACKEND_URL}/proxy/media/${uuid}${fileType ? '?fileType=' + encodeURIComponent(fileType) : ''}`;
    // console.log("Image URL:", imageUrl);
    return (
        <img
        src={imageUrl}
        alt={altText || "Media Image"}
        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
        // style={{ width: `${width}px`, height: `${height}px` }}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    )
};

export default MediaImage;