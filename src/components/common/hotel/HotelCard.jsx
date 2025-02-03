import MediaImage from "../media/MediaImage";


const HotelCard = ({ hotel }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
      <div className="w-full h-48 overflow-hidden">
        <MediaImage uuid={hotel.image} fileType={"Small Thumbnail"}/>
      </div>
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
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{hotel.description}</p>
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

  export default HotelCard;
