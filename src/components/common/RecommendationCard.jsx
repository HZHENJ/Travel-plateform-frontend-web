const RecommendationCard = ({ image, title, description, price, rating }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105 h-96 w-72 mx-auto flex flex-col">
      <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-semibold mb-2 truncate" title={title}>
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-4" title={description}>
            {description}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-blue-600 font-bold">{price}</span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-gray-600">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  export default RecommendationCard;
  