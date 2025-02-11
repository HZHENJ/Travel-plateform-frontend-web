import { useEffect, useState, useCallback } from "react"
import { ArrowLeft, ArrowRight, Star, MapPin, Clock, Ticket, Navigation, Mail, Globe, Phone } from "lucide-react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer";

import { Button } from "@/components/ui/button"

import { useNavigate, useParams } from "react-router-dom";
import { fetchHotelsByUUID } from "../../api/hotels";

import HotelBookingModal from "../../components/common/hotel/BookingModal"; 

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
  const [hotelDetail, setHotels] = useState(null)
  const [visibleReviews, setVisibleReviews] = useState(3)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const openBookingModal = useCallback(() => setIsBookingModalOpen(true), [])
  const closeBookingModal = useCallback(() => setIsBookingModalOpen(false), [])

  const navigate = useNavigate();

  // back to Hotels page
  const turnBack = () => {
    navigate('/hotels');
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchHotelsByUUID(uuid);
        const hotel = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
        setHotels(hotel)
      } catch (error) {
        console.error("HotelDetail", error)
      }
    };
    getData();
  }, [uuid]);

  console.log("hotel detail:", hotelDetail)

  // UI
  if (!hotelDetail) {
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
          <ImageCarousel images={hotelDetail.images} />

          <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{hotelDetail.name}</h1>
                  <div className="flex items-center mb-4">
                    <Star className="text-yellow-400 w-5 h-5" />
                    <span className="ml-1 font-semibold">{hotelDetail.rating}</span>
                    <span className="ml-2 text-gray-600">({1000}+ reviews)</span>
                  </div>
                </div>
                <Button onClick={openBookingModal} className="bg-blue-500">Book Now</Button>
              </div>
              {/* address */}
              <p className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                {hotelDetail.address ? `${hotelDetail.address.block || ""} ${hotelDetail.address.streetName || ""}, ${hotelDetail.address.postalCode || ""}`: "Unknown address"}
              </p>
              <h2 className="text-xl font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap mb-6">
                {hotelDetail.amenities ? hotelDetail.amenities.split(/[;,]/).slice(0, 4).map((amenity, index) =>(
                    <span key={index} className="bg-gray-200 text-sm rounded-full px-2 py-1 m-1">
                      {amenity.trim()}
                    </span>
                  )): <span className="text-gray-500">No amenities available</span>
                }
              </div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: hotelDetail.body }}></div>
              {/* <p className="text-gray-700 mb-6">{hotelDetail.description}</p> */}
              
              <h2 className="text-xl font-semibold mb-2">Nearest MRT Station</h2>
              <p className="flex items-center text-gray-700 mb-6">
                <Navigation className="w-5 h-5 mr-2" />
                {hotelDetail.nearestMrtStation}
              </p>

              <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
              <div className="space-y-2 mb-6">
                <p className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 mr-2" />
                  <a href={`mailto:${hotelDetail.officialEmail}`} className="text-blue-600 hover:underline">
                    {hotelDetail.officialEmail}
                  </a>
                </p>
                
                <p className="flex items-center text-gray-700">
                  <Globe className="w-5 h-5 mr-2" />
                  <a
                    href={hotelDetail.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {hotelDetail.officialWebsite}
                  </a>
                </p>

                <p className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-2" />
                  {hotelDetail?.contact?.primaryContactNo || hotelDetail?.contact?.secondaryContactNo || "No Contact"}
                </p>
              </div>
              
              <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
              <p className="text-gray-700 mb-2">Company: {hotelDetail.companyDisplayName}</p>
              <p className="text-gray-700 mb-2">Type: {hotelDetail.type}</p>
              <p className="text-gray-700 mb-2">
                Temporarily Closed: {hotelDetail.temporarilyClosed === "N" ? "No" : "Yes"}
              </p>
            </div>
          </div>

          {/* reviews */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {
                hotelDetail.reviews.length > 0 ? 
                hotelDetail.reviews.slice(0, visibleReviews).map((review, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center mb-2">
                    <Star className="text-yellow-400 w-5 h-5" />
                    <span className="ml-1 font-semibold">{review.rating}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-500">- {review.user}</p>
                </div>
              )) : <p>No Reviews</p>
            }
            </div>
            {visibleReviews < hotelDetail.reviews.length && (
              <div className="mt-4 text-center">
                <button
                  onClick={loadMoreReviews}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* 预订模态框 */}
      <HotelBookingModal uuid={hotelDetail.uuid} hotelName={hotelDetail.name} isOpen={isBookingModalOpen} onClose={closeBookingModal} />
    </div>
  )
}

export default HotelDetailPage;

