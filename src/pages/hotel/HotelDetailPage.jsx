import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Wifi,
  PocketIcon as Pool,
  Dumbbell,
  Utensils,
  Coffee,
  Tv,
  Car,
  Snowflake,
  Users,
  BedDouble,
  MapPin,
} from "lucide-react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer";

const amenityIcons = {
  "免费Wi-Fi": <Wifi className="w-5 h-5" />,
  游泳池: <Pool className="w-5 h-5" />,
  健身中心: <Dumbbell className="w-5 h-5" />,
  餐厅: <Utensils className="w-5 h-5" />,
  咖啡厅: <Coffee className="w-5 h-5" />,
  电视: <Tv className="w-5 h-5" />,
  停车场: <Car className="w-5 h-5" />,
  空调: <Snowflake className="w-5 h-5" />,
}

const hotel = {
  id: 1,
  name: "滨海湾金沙酒店",
  images: [
    "/placeholder.svg?height=400&width=600&text=滨海湾金沙酒店1",
    "/placeholder.svg?height=400&width=600&text=滨海湾金沙酒店2",
    "/placeholder.svg?height=400&width=600&text=滨海湾金沙酒店3",
    "/placeholder.svg?height=400&width=600&text=滨海湾金沙酒店4",
  ],
  price: 1500,
  rating: 4.8,
  reviewCount: 1234,
  location: "滨海湾",
  amenities: ["免费Wi-Fi", "游泳池", "健身中心", "餐厅", "咖啡厅", "电视", "停车场", "空调"],
  description:
    "滨海湾金沙酒店是新加坡的标志性建筑之一，位于滨海湾中心地带。这家豪华五星级酒店以其令人惊叹的无边泳池和壮观的城市景观而闻名。",
  longDescription:
    "滨海湾金沙酒店不仅仅是一家酒店，它是一个综合度假胜地。酒店内设有世界级的赌场、豪华购物中心、艺术科学博物馆以及多家米其林星级餐厅。位于酒店顶层的无边泳池是世界上最大的空中泳池之一，提供了令人惊叹的360度全景。无论是商务旅行还是休闲度假，滨海湾金沙酒店都能为客人提供难忘的奢华体验。",
  rooms: [
    { type: "豪华客房", price: 1500, capacity: 2 },
    { type: "尊贵套房", price: 2500, capacity: 2 },
    { type: "家庭套房", price: 3000, capacity: 4 },
  ],
}

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
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
          <img src={image || "/placeholder.svg"} alt={`酒店图片 ${index + 1}`} className="w-full h-full object-cover" />
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

export default function HotelDetail() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
          <button className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>返回酒店列表</span>
          </button>

          <ImageCarousel images={hotel.images} />

          <div className="mt-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-400 w-5 h-5" />
                <span className="ml-1 font-semibold">{hotel.rating}</span>
                <span className="ml-2 text-gray-600">({hotel.reviewCount} 条评价)</span>
              </div>
              <p className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                {hotel.location}
              </p>
              <p className="text-gray-700 mb-6">{hotel.description}</p>
              <h2 className="text-xl font-semibold mb-2">酒店设施</h2>
              <div className="flex flex-wrap mb-6">
                {hotel.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {amenityIcons[amenity]}
                    <span className="ml-1">{amenity}</span>
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-semibold mb-2">酒店详情</h2>
              <p className="text-gray-700 mb-6">{hotel.longDescription}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">选择房型</h2>
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

