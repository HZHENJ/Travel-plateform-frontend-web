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
        if (response && response.data) {
          console.log(response.data.data)
          // 1.transform the data
          let newHotels = transformHotels(response.data.data);
          // 2. 过滤掉没有价格的酒店
          // newHotels = newHotels.filter(hotel => hotel.price && hotel.price !== "No Price");
          setHotels(newHotels);
          // 3.get total pages
          setTotalPages(Math.ceil(response.data.totalRecords / hotelsPerPage));
        } 
      } catch (error) {
        console.error("Error", error);
      } 
    };
    getData();
  }, [currentPage])

  const transformHotels = (data) => {
  return data.map((hotel) => {
    let image = hotel.thumbnails && hotel.thumbnails.length > 0
      ? hotel.thumbnails[0].uuid
      : null;

    if (!image && hotel.images && hotel.images.length > 0) {
      const primaryImage = hotel.images.find(img => img.uuid);
      image = primaryImage ? primaryImage.uuid : null;
    }

    if (!image) {
      image = '/images/404.jpg';
    }

    return {
      uuid: hotel.uuid,
      name: hotel.name || "Unknown Hotel",
      address: hotel.address 
        ? `${hotel.address.block || ""} ${hotel.address.streetName || ""}, ${hotel.address.postalCode || ""}`
        : "Unknown address",
      rating: hotel.rating > 0 ? hotel.rating : "No Rating", // 处理 0 评分
      price: hotel.leadInRoomRates || "No Price",
      image, // 确保最终 `image` 是有效的
      amenities: hotel.amenities ? hotel.amenities.split(/[;,]/) : [], // 处理设施
    };
  });
};


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Singapore Hotel</h1>

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