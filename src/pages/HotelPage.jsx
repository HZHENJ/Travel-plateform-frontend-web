import { useState } from "react"
import {} from "lucide-react"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer";
import HotelCard from "../components/common/HotelCard"


// data
const hotels = [
    {
      id: 1,
      name: "滨海湾金沙酒店",
      image: "/placeholder.svg?height=200&width=300&text=滨海湾金沙酒店",
      price: 1500,
      rating: 4.8,
      location: "滨海湾",
      amenities: ["游泳池", "健身中心", "Spa", "免费Wi-Fi"],
      description: "豪华五星级酒店，拥有标志性的无边泳池和壮观的城市景观。",
    },
    {
      id: 2,
      name: "丽思卡尔顿美年酒店",
      image: "/placeholder.svg?height=200&width=300&text=丽思卡尔顿美年酒店",
      price: 1200,
      rating: 4.7,
      location: "滨海湾",
      amenities: ["餐厅", "酒吧", "会议室", "免费Wi-Fi"],
      description: "位于市中心的奢华酒店，提供顶级服务和设施。",
    },
    {
      id: 3,
      name: "圣淘沙名胜世界硬石酒店",
      image: "/placeholder.svg?height=200&width=300&text=圣淘沙名胜世界硬石酒店",
      price: 980,
      rating: 4.5,
      location: "圣淘沙",
      amenities: ["主题公园", "水上乐园", "赌场", "免费Wi-Fi"],
      description: "位于圣淘沙岛上的现代化度假酒店，靠近环球影城。",
    },
    {
      id: 4,
      name: "新加坡文华东方酒店",
      image: "/placeholder.svg?height=200&width=300&text=新加坡文华东方酒店",
      price: 1300,
      rating: 4.9,
      location: "滨海湾",
      amenities: ["米其林餐厅", "豪华Spa", "户外泳池", "免费Wi-Fi"],
      description: "坐落于滨海湾，提供优雅的住宿和米其林星级餐厅。",
    },
    {
      id: 5,
      name: "新加坡悦乐圣淘沙酒店",
      image: "/placeholder.svg?height=200&width=300&text=新加坡悦乐圣淘沙酒店",
      price: 850,
      rating: 4.4,
      location: "圣淘沙",
      amenities: ["私人海滩", "儿童俱乐部", "多个泳池", "免费Wi-Fi"],
      description: "位于圣淘沙岛的度假酒店，拥有私人海滩和多个泳池。",
    },
    {
      id: 6,
      name: "新加坡富丽敦酒店",
      image: "/placeholder.svg?height=200&width=300&text=新加坡富丽敦酒店",
      price: 1100,
      rating: 4.6,
      location: "滨海湾",
      amenities: ["河畔餐厅", "屋顶酒吧", "健身中心", "免费Wi-Fi"],
      description: "位于新加坡河畔的标志性殖民地风格酒店。",
    },
    {
      id: 7,
      name: "新加坡洲际酒店",
      image: "/placeholder.svg?height=200&width=300&text=新加坡洲际酒店",
      price: 1050,
      rating: 4.5,
      location: "乌节路",
      amenities: ["屋顶泳池", "日式餐厅", "水疗中心", "免费Wi-Fi"],
      description: "位于乌节路购物区的豪华酒店，拥有顶级设施和服务。",
    },
    {
      id: 8,
      name: "新加坡香格里拉酒店",
      image: "/placeholder.svg?height=200&width=300&text=新加坡香格里拉酒店",
      price: 1150,
      rating: 4.7,
      location: "乌节路",
      amenities: ["热带花园", "多个餐厅", "儿童游乐区", "免费Wi-Fi"],
      description: "坐落在热带花园中的奢华酒店，距离乌节路购物区仅几步之遥。",
    },
]

// 
const HotelPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const hotelsPerPage = 6

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priceFilter === "all" ||
        (priceFilter === "low" && hotel.price < 1000) ||
        (priceFilter === "medium" && hotel.price >= 1000 && hotel.price < 1300) ||
        (priceFilter === "high" && hotel.price >= 1300)) &&
      (ratingFilter === "all" ||
        (ratingFilter === "4" && hotel.rating >= 4 && hotel.rating < 4.5) ||
        (ratingFilter === "4.5" && hotel.rating >= 4.5)),
  )

  const indexOfLastHotel = currentPage * hotelsPerPage
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">新加坡酒店</h1>

          <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="搜索酒店..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            <select
              className="w-full md:w-auto px-4 py-2 border rounded-lg"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">所有价格</option>
              <option value="low">￥1000以下</option>
              <option value="medium">￥1000-￥1300</option>
              <option value="high">￥1300以上</option>
            </select>

            <select
              className="w-full md:w-auto px-4 py-2 border rounded-lg"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">所有评分</option>
              <option value="4">4星及以上</option>
              <option value="4.5">4.5星及以上</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>

          {filteredHotels.length === 0 && <p className="text-center text-gray-600 mt-8">没有找到符合条件的酒店。</p>}

          {filteredHotels.length > hotelsPerPage && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-1 px-4 py-2 border rounded-md disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              {Array.from({ length: Math.ceil(filteredHotels.length / hotelsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-1 px-4 py-2 border rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : ""}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredHotels.length / hotelsPerPage)}
                className="mx-1 px-4 py-2 border rounded-md disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HotelPage