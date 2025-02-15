import { useState, useEffect } from "react";
import { fetchHotels, fetchReviewStatsByUUID, fetchHotelByKeyword } from "../../api/hotels";
import { useToast } from "../../components/common/MessageBox";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HotelCard from "../../components/common/hotel/HotelCard";
import Pagination from "../../components/common/Pagination";

const HotelPage = () => {
  const [hotels, setHotels] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const { addToast } = useToast();

  const hotelsPerPage = 6;
  const offset = (currentPage - 1) * hotelsPerPage;

  // 获取所有酒店数据（默认模式）
  const getData = async () => {
    try {
      const response = await fetchHotels(offset, hotelsPerPage);
      if (response && response.data) {
        let newHotels = transformHotels(response.data.data);
        const totalRecords = response.data.totalRecords || 0;

        const uuids = newHotels.map(hotel => hotel.uuid);
        const stats = await Promise.all(
          uuids.map(async (uuid) => {
            try {
              const statsResponse = await fetchReviewStatsByUUID(uuid);
              return {
                averageRating: statsResponse?.data?.averageRating || 0,
                totalReviews: statsResponse?.data?.totalReviews || 0,
              };
            } catch (error) {
              console.error(`Error fetching rating for ${uuid}:`, error);
              return { averageRating: 0, totalReviews: 0 };
            }
          })
        );

        newHotels = newHotels.map((hotel, index) => ({
          ...hotel,
          rating: stats[index].averageRating,
          totalReviews: stats[index].totalReviews,
        }));

        setHotels(newHotels);
        setTotalPages(Math.ceil(totalRecords / hotelsPerPage));
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  // 处理搜索
  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setCurrentPage(1);
      getData();
      addToast("Please enter a search keyword!", "warning", 1000);
      return;
    }

    setIsSearching(true);
    setCurrentPage(page);

    try {
      const response = await fetchHotelByKeyword(searchQuery, (page - 1) * hotelsPerPage, hotelsPerPage);
      if (response && response.data) {
        let searchedHotels = transformHotels(response.data.data);
        const totalRecords = response.data.totalRecords || 0;

        const uuids = searchedHotels.map(hotel => hotel.uuid);
        const stats = await Promise.all(
          uuids.map(async (uuid) => {
            try {
              const statsResponse = await fetchReviewStatsByUUID(uuid);
              return {
                averageRating: statsResponse?.data?.averageRating || 0,
                totalReviews: statsResponse?.data?.totalReviews || 0,
              };
            } catch (error) {
              console.error(`Error fetching rating for ${uuid}:`, error);
              return { averageRating: 0, totalReviews: 0 };
            }
          })
        );

        searchedHotels = searchedHotels.map((hotel, index) => ({
          ...hotel,
          rating: stats[index].averageRating,
          totalReviews: stats[index].totalReviews,
        }));

        setHotels(searchedHotels);
        setTotalPages(Math.ceil(totalRecords / hotelsPerPage));
      }
    } catch (error) {
      console.error("Error searching hotels:", error);
    }
  };

  useEffect(() => {
    if (isSearching) {
      handleSearch(currentPage);
    } else {
      getData();
    }
  }, [currentPage]);

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
        image = "/images/404.jpg";
      }

      return {
        uuid: hotel.uuid,
        name: hotel.name || "Unknown Hotel",
        address: hotel.address
          ? `${hotel.address.block || ""} ${hotel.address.streetName || ""} ${hotel.address.postalCode || ""}`
          : "Unknown address",
        rating: 0,
        totalReviews: 0,
        price: hotel.leadInRoomRates || "No Price",
        image,
        amenities: hotel.amenities ? hotel.amenities.split(/[;,]/) : [],
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Singapore Hotels</h1>

          {/* 搜索框区域 */}
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search for a hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => handleSearch(1)}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg transition duration-300 hover:bg-blue-600 hover:shadow-md"
            >
              Search
            </button>
          </div>

          {/* 酒店卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.length > 0 ? (
              hotels.map((hotel) => <HotelCard key={hotel.uuid} hotel={hotel} />)
            ) : (
              <p className="text-center text-gray-600 mt-8 col-span-full">
                No matching hotels were found.
              </p>
            )}
          </div>

          {/* 分页组件 */}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HotelPage;
