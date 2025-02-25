import { useNavigate } from "react-router-dom";
import MediaImage from "../media/MediaImage";

const HotelCard = ({ hotel }) => {
  if (!hotel) return null;

  const navigate = useNavigate(); // 使用 useNavigate 实现导航
  const isDisabled = hotel.price === "No Price"; // 判断是否无价格

  const handleCardClick = () => {
    if (!isDisabled) {
      navigate(`/hotels/${hotel.uuid}`); // 仅允许有价格的酒店跳转
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform ${
        isDisabled 
          ? "opacity-50 grayscale cursor-not-allowed hover:scale-100"  // 无价格的酒店变灰色，不能点击
          : "hover:scale-105 hover:shadow-xl cursor-pointer" // 正常酒店可点击
      }`}
      style={isDisabled ? { pointerEvents: "none" } : {}} // 彻底禁用点击事件
    >
        
        {/* image area */}
        <div className="w-full h-48 overflow-hidden">
          <MediaImage uuid={hotel.image} fileType={"Small Thumbnail"}/>
        </div>

        {/* content area */}
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
          <p className="text-gray-600 mb-2">{hotel.location}</p>
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1">{hotel.rating}</span>
          </div>
          <p className="text-lg font-bold mb-2">{hotel.price}</p>

          {/* amenities area */}
          <div className="flex flex-wrap">
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <span key={index} className="bg-gray-200 text-sm rounded-full px-2 py-1 m-1">
                {amenity}
              </span>
            ))}
          </div>
        </div>

    </div>
  );
};

export default HotelCard;
