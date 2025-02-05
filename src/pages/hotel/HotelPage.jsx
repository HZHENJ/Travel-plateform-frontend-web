import {} from "lucide-react"
import { useState, useEffect } from "react"
import { fetchHotels } from "../../api/hotels"

import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer";
import HotelCard from "../../components/common/hotel/HotelCard"
import Pagination from "../../components/common/Pagination";

// 
const HotelPage = () => {
  const [hotels, setHotels] = useState([]) // save the data fetched from the API
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const hotelsPerPage = 6
  const offset = (currentPage - 1) * hotelsPerPage

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchHotels(offset, hotelsPerPage);
        // console.log("API Data:", response.data);
        if (response && response.data) {
          // 1.transform the data
          const newHotels = transformHotels(response.data.data);
          setHotels(newHotels);

          console.log("Hotels", newHotels)

          // 2.get total pages
          setTotalPages(Math.ceil(response.data.totalRecords / hotelsPerPage));
        } 
      } catch (error) {
        console.error("Error", error);
      } 
    };
    getData();
  }, [currentPage])

  // parse the data from the API
  const transformHotels = (data) => {
    return data.map((hotel) => ({
      uuid: hotel.uuid,
      name: hotel.name || "Unknown Hotel",
      address: hotel.address ? `${hotel.address.block || ""} ${hotel.address.streetName || ""}, ${hotel.address.postalCode || ""}`: "Unknow address",
      rating: hotel.rating > 0 ? hotel.rating : "No Rating", // 处理 0 评分
      price: hotel.leadInRoomRates || "No Price",
      image: (hotel.thumbnails && hotel.thumbnails.length > 0)
      ? hotel.thumbnails[0].uuid
      : "101bc4fab99f6d6476d9fc609a50c20ebc6", 
      amenities: hotel.amenities ? hotel.amenities.split(/[;,]/) : [], // 处理设施
    }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Singapore Hotel</h1>

          {/* filter area */}
          {/* <div className="mb-8 flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search hotels..."
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

            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-40 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All prices</option>
                <option value="low">Below $1000</option>
                <option value="medium">$1000-$1300</option>
                <option value="high">$1300 and above</option>
              </select>
            </div>

            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-40 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="all">All ratings</option>
                <option value="4">4 stars and above</option>
                <option value="4.5">4.5stars and above</option>
              </select>
            </div>
          </div> */}

          {/* Hotel card area */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                  <HotelCard key={hotel.uuid} hotel={hotel}/>
              ))
            ) : (
              <p className="text-center text-gray-600 mt-8 col-span-full">No matching hotels were found.</p>
            )}
          </div>
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HotelPage;