import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Star, MapPin} from "lucide-react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { fetchHotelsByUUID } from "../../api/hotels";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ImageCarousel
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const getImageURLByUUID = (uuid, fileType) => {
    return `${BACKEND_URL}/proxy/media/${uuid}${fileType ? '?fileType=' + encodeURIComponent(fileType) : ''}`;
  }

  return (
    <div className="relative w-full h-96">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={getImageURLByUUID(image.uuid, "Thumbnail 1080h") || "/placeholder.svg"}
            alt={`images ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  )
}

const HotelDetailPage = () => {
  const { uuid } = useParams();
  const [hotelDetial, setHotels] = useState(null)
  const navigate = useNavigate();

  // back to Hotels page
  const turnBack = () => {
    navigate('/hotels');
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchHotelsByUUID(uuid);
        const hotel_ = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
        setHotels(hotel_)
      } catch (error) {
        console.error("HotelDetail", error)
      }
    };
    getData();
  }, [uuid]);

  console.log("hotel detail:", hotelDetial)

  if (!hotelDetial) {
    return <p>Loading ... </p>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-4">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={turnBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4" >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Return to hotel list</span>
          </button>

          <ImageCarousel images={hotelDetial.images} />

          <div className="mt-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{hotelDetial.name}</h1>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-400 w-5 h-5" />
                <span className="ml-1 font-semibold">{hotelDetial.rating}</span>
                <span className="ml-2 text-gray-600">({1000}+ reviews)</span>
              </div>
              <p className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                {hotelDetial.address
                ? `${hotelDetial.address.block || ""} ${hotelDetial.address.streetName || ""}, ${hotelDetial.address.postalCode || ""}`
                : "Unknown address"}
              </p>
              <h2 className="text-xl font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap mb-6">
                {
                  hotelDetial.amenities ? hotelDetial.amenities.split(/[;,]/).slice(0, 4).map((amenity, index) =>(
                    <span key={index} className="bg-gray-200 text-sm rounded-full px-2 py-1 m-1">
                      {amenity.trim()}
                    </span>
                  ))
                  : <span className="text-gray-500">No amenities available</span>
                }
              </div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 mb-6">{hotelDetial.description}</p>
            </div>

            {/* <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Select room type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotel.rooms.map((room, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">{room.type}</h3>
                    <p className="text-gray-600 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      最多 {room.capacity} 人
                    </p>
                    <p className="text-gray-600 mb-2 flex items-center">
                      <BedDouble className="w-4 h-4 mr-1" />
                      1张大床
                    </p>
                    <p className="text-xl font-bold mb-2">￥{room.price} / 晚</p>
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                      选择
                    </button>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HotelDetailPage;

