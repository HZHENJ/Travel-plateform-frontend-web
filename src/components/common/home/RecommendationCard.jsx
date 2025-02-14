import { useState, useEffect } from "react";
import { fetchAttractoionsByUUID } from "../../../api/attractions";
import { useNavigate } from "react-router-dom";
import MediaImage from "../media/MediaImage";


const RecommendationCard = ({item}) => {
  if (!item) return null;

  const navigate = useNavigate(); 
  const handleClick = () => {
    navigate(`/attractions/${item.uuid}`); // 跳转到详情页
  };

  const [attractionDetail, setAttractions] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchAttractoionsByUUID(item.uuid);
        const attraction = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
        setAttractions(attraction)
      } catch (error) {
        console.error("Attraction", error)
      }
    };
    getData();
  }, [item.uuid]);

  // console.log(attractionDetail)

  if (!attractionDetail) {
    return <p>Loading ... </p>
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105 hover:z-50 h-96 w-72 mx-auto flex flex-col"
        onClick={handleClick}>
      {/* image area */}
      <div className="w-full h-48 overflow-hidden">
        <MediaImage uuid={attractionDetail.thumbnails[0].uuid} fileType={"Small Thumbnail"}/>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-semibold mb-2 truncate" title={attractionDetail.title}>
            {attractionDetail.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-4" title={attractionDetail.description}>
            {attractionDetail.description}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-blue-600 font-bold">{attractionDetail.price}</span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-gray-600">{attractionDetail.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RecommendationCard;
  