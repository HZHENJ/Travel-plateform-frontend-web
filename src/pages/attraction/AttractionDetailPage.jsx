import { useEffect, useState, useCallback } from "react"
import { ArrowLeft, ArrowRight, Star, MapPin, Clock, Ticket, Navigation, Mail, Globe, Phone } from "lucide-react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer";

import { Button } from "@/components/ui/button"
import { BookingModal } from "@/components/common/attraction/BookingModal";

import { useNavigate, useParams } from "react-router-dom";
import { fetchAttractoionsByUUID, fetchReviewRatingByUUID } from "../../api/attractions";

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

// main page
const AttractionDetailPage = () => {
  const { uuid } = useParams();
  const [attractionDetail, setAttractions] = useState(null)
  const [reviews, setReviews] = useState({})
  const [visibleReviews, setVisibleReviews] = useState(3)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const openBookingModal = useCallback(() => setIsBookingModalOpen(true), [])
  const closeBookingModal = useCallback(() => setIsBookingModalOpen(false), [])

  const loadMoreReviews = () => {
    setVisibleReviews(prev => prev + 3);  // 每次显示多 3 条评论
  };

  const navigate = useNavigate();

  // back to Hotels page
  const turnBack = () => {
    navigate('/attractions');
  }

  useEffect(() => {
    const getData = async () => {
      // fetch data
      try {
        const reviewsData = await fetchReviewRatingByUUID(uuid); // 这里注意需要有数据库才可以！！！
        const filteredReviews = reviewsData.filter(review => review.status === "show");
        setReviews(filteredReviews)
      } catch (error) {
        console.error("reviewsData - no uuid", error)
      }

      // 
      try {
        const attractionData = await fetchAttractoionsByUUID(uuid);
        const attraction = Array.isArray(attractionData.data) && attractionData.data.length > 0 ? attractionData.data[0] : null;
        setAttractions(attraction)
      } catch (error) {
        console.error("attraction", error)
      }
    };
    getData();
  }, [uuid]);

  // debug
  // console.log("attractionDetail detail:", attractionDetail)
  // console.log("Reviews:", reviews)

  // UI
  if (!attractionDetail) {
    return <p>Loading ... </p>
  }

  // Can not to move to other positions !!!
  const pricePerPerson = parseFloat(attractionDetail.pricing.others.replace(/[^0-9.]/g, ""));

  // handle opening hours
  const weekDaysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "public_holiday"];
  const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  const businessHours = attractionDetail?.businessHour || [];

  const groupedHours = businessHours.reduce((acc, hour) => {
    if (!acc[hour.day]) {
      acc[hour.day] = [];
    }
    acc[hour.day].push(`${hour.openTime} - ${hour.closeTime}`);
    return acc;
  }, {});

  // 按照 weekDaysOrder 排序
  const sortedBusinessHours = Object.keys(groupedHours).sort((a, b) => weekDaysOrder.indexOf(a) - weekDaysOrder.indexOf(b))
  .map((day) => ({
    day: capitalizeFirstLetter(day),
    times: groupedHours[day].join(", "),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-4">
        <div className="container mx-auto px-4 py-4">
            <button 
              onClick={turnBack}
              className="flex items-center text-blue-600 hover:text-blue-800" >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Return to Attractions list</span>
            </button>
          </div>
        <ImageCarousel images={attractionDetail.images} />

        <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{attractionDetail.name}</h1>
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-400 w-5 h-5" />
                  <span className="ml-1 font-semibold">{attractionDetail.rating}</span>
                  <span className="ml-2 text-gray-600">({attractionDetail.reviewCount} reviews)</span>
                </div>
              </div>
              <Button onClick={openBookingModal} className="bg-blue-500">Book Now</Button>
            </div>

            {/* address */}
            <p className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              {attractionDetail.address.streetName}, {attractionDetail.address.postalCode}
            </p>
            <div className="flex flex-wrap mb-6">
              {attractionDetail.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1 m-1">
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: attractionDetail.body }}></div>
            <h2 className="text-xl font-semibold mb-2">Opening Hours</h2>

            {
              sortedBusinessHours.length === 0 ? (
                <p className="text-gray-500">No Opening Hours Available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {sortedBusinessHours.map((hour) => (
                    <div key={hour.day} className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-2" />
                      <span className="font-semibold">{hour.day}: </span>
                      <span className="ml-1">{hour.times}</span>
                    </div>
                  ))}
                </div>
              )}

            {attractionDetail.businessHourNotes && (
              <p className="text-sm text-gray-600 mb-6">{attractionDetail.businessHourNotes.notes}</p>
            )}

            <h2 className="text-xl font-semibold mb-2">Ticket Prices</h2>
            <p className="flex items-center text-gray-700 mb-6">
              <Ticket className="w-5 h-5 mr-2" />
              {attractionDetail.pricing.others}
            </p>

            <h2 className="text-xl font-semibold mb-2">Admission Information</h2>
            <p className="text-gray-700 mb-6">{attractionDetail.admissionInfo}</p>

            <h2 className="text-xl font-semibold mb-2">Nearest MRT Station</h2>
            <p className="flex items-center text-gray-700 mb-6">
              <Navigation className="w-5 h-5 mr-2" />
              {attractionDetail.nearestMrtStation}
            </p>

            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <div className="space-y-2 mb-6">
              <p className="flex items-center text-gray-700">
                <Mail className="w-5 h-5 mr-2" />
                <a href={`mailto:${attractionDetail.officialEmail}`} className="text-blue-600 hover:underline">
                  {attractionDetail.officialEmail}
                </a>
              </p>
              <p className="flex items-center text-gray-700">
                <Globe className="w-5 h-5 mr-2" />
                <a
                  href={attractionDetail.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {attractionDetail.officialWebsite}
                </a>
              </p>
              <p className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 mr-2" />
                {attractionDetail?.contact?.primaryContactNo || attractionDetail?.contact?.secondaryContactNo || "No Contact"}
              </p>
            </div>

            <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
            <p className="text-gray-700 mb-2">Company: {attractionDetail.companyDisplayName}</p>
            <p className="text-gray-700 mb-2">Type: {attractionDetail.type}</p>
            <p className="text-gray-700 mb-2">Ticketed: {attractionDetail.ticketed === "Y" ? "Yes" : "No"}</p>
            <p className="text-gray-700 mb-2">
              Temporarily Closed: {attractionDetail.temporarilyClosed === "N" ? "No" : "Yes"}
            </p>
          </div>
        </div>

        {/* reviews */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              reviews.length > 0 ? 
              reviews.slice(0, visibleReviews).map((review, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center mb-2">
                  <Star className="text-yellow-400 w-5 h-5" />
                  <span className="ml-1 font-semibold">{review.rating}</span>
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <p className="text-sm text-gray-500">- {review.username}</p>
              </div>
            )) : <p>No Reviews</p>
          }
          </div>
          {visibleReviews < reviews.length && (
            <div className="mt-4 text-center">
              <button onClick={loadMoreReviews} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        pricePerPerson={pricePerPerson}
        businessHours={attractionDetail.businessHour}
        uuid={attractionDetail.uuid}
      />
    </div>
  )
}

export default AttractionDetailPage;

