const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const checkImageAvailable = async (uuid) => {
    if (!uuid) return false;
    const imageUrl = `${BACKEND_URL}/proxy/media/${uuid}`;
  
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok; // 如果 HTTP 状态码是 200，则图片可用
    } catch (error) {
      console.error("Image check failed:", error);
      return false;
    }
  };

export const getValidImage = async (hotel) => {
    if (hotel.thumbnails && hotel.thumbnails.length > 0) {
        for (const thumbnail of hotel.thumbnails) {
        if (await checkImageAvailable(thumbnail.uuid)) {
            return thumbnail.uuid;
        }
        }
    }

    if (hotel.images && hotel.images.length > 0) {
        for (const image of hotel.images) {
        if (await checkImageAvailable(image.primaryFileMediumUuid)) {
            return image.primaryFileMediumUuid;
        }
        }
    }

    return "/images/404.jpg"; // 都不可用，使用默认图片
};