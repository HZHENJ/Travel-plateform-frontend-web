import { useToast } from '../../components/common/MessageBox'
import { useState, useEffect } from "react"

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Pagination from "../../components/common/Pagination";
import AttractionCard from "../../components/common/attraction/AttractionCard"
import { fetchAttraction, fetchReviewStatsByUUID, fetchAttractionByKeyword } from "../../api/attractions";

const AttractionPage = () => {

    const [attractions, setAttraction] = useState([]); // save the data fetched from the api
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isSearching, setIsSearching] = useState(false); // 是否处于搜索状态

    const { addToast } = useToast();

    const attractionPrePage = 6
    const offset = (currentPage - 1) * attractionPrePage

    const getData = async () => {
        try {
            const response = await fetchAttraction(offset, attractionPrePage);
            if (response && response.data) {
                // 解析景点数据
                let newAttractions = transformAttractions(response.data.data);
    
                // 获取所有景点的 UUID
                const uuids = newAttractions.map(attraction => attraction.uuid);
    
                // 批量获取评分
                const ratings = await Promise.all(
                    uuids.map(async (uuid) => {
                        try {
                            const ratingResponse = await fetchReviewStatsByUUID(uuid);
                            return {
                                averageRating: ratingResponse?.data?.averageRating || 0, // 默认评分 0
                                totalReviews: ratingResponse?.data?.totalReviews || 0
                            }
                        } catch (error) {
                            console.error(`Error fetching rating for ${uuid}:`, error);
                            return 0; // 出错时返回默认评分
                        }
                    })
                );
    
                // 将评分合并到景点数据中
                newAttractions = newAttractions.map((attraction, index) => ({
                    ...attraction,
                    rating: ratings[index].averageRating,
                    totalReviews: ratings[index].totalReviews
                }));
    
                // 更新状态
                setAttraction(newAttractions);
                setTotalPages(Math.ceil(response.data.totalRecords / attractionPrePage));
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    const handleSearch = async (page = 1) => {
        if (!searchQuery.trim()) {
            setIsSearching(false);
            setCurrentPage(1);
            getData();
            addToast("Please enter a search keyword!", 'warning', 1000);
            return;
        }

        setIsSearching(true);
        setCurrentPage(page);

        try {
            const response = await fetchAttractionByKeyword(searchQuery, (page - 1) * attractionPrePage, attractionPrePage);
            if (response && response.data) {
                let searchedAttractions = transformAttractions(response.data.data);
                const totalRecords = response.data.totalRecords || 0;

                const uuids = searchedAttractions.map(attraction => attraction.uuid);
                const ratings = await Promise.all(
                    uuids.map(async (uuid) => {
                        try {
                            const ratingResponse = await fetchReviewStatsByUUID(uuid);
                            return {
                                averageRating: ratingResponse?.data?.averageRating || 0,
                                totalReviews: ratingResponse?.data?.totalReviews || 0
                            };
                        } catch (error) {
                            console.error(`Error fetching rating for ${uuid}:`, error);
                            return { averageRating: 0, totalReviews: 0 };
                        }
                    })
                );

                searchedAttractions = searchedAttractions.map((attraction, index) => ({
                    ...attraction,
                    rating: ratings[index].averageRating,
                    totalReviews: ratings[index].totalReviews
                }));

                setAttraction(searchedAttractions);
                setTotalPages(Math.ceil(totalRecords / attractionPrePage)); // 修正分页计算
            }
        } catch (error) {
            console.error("Error searching attractions:", error);
        }
    };
    
    useEffect(() => {
        if (isSearching) {
            handleSearch(currentPage); // 在搜索模式下分页
        } else {
            getData(); // 在默认模式下分页
        }
    }, [currentPage])

    // parse the data from the api
    const transformAttractions = (data) => {
        return data.map((attraction) => ({
            uuid: attraction.uuid,
            name: attraction.name || "Unknow Hotel",
            address: attraction.address ? `${attraction.address.block || ""} ${attraction.address.streetName || ""} ${attraction.address.postalCode || ""}`: "Unknow address",
            description: attraction.description || "No description available",
            type: attraction.categoryDescription || "Unknown",
            tags: attraction.tags || [],
            businessHours: attraction.businessHour ? attraction.businessHour.map((hour) => ({
                day: hour.day,
                open: hour.openTime,
                close: hour.closeTime,
              })): [],
            contactNumber: attraction.contact?.primaryContactNo || "No contact available",
            pricing: attraction.pricing?.others || "Price not available",
            website: attraction.officialWebsite || "No website available",
            rating: 0,
            totalReviews: 0,
            image: (attraction.thumbnails && attraction.thumbnails.length > 0) ? attraction.thumbnails[0].uuid: "/images/404.jpg", 
            ticketRequired: attraction.ticketed === "Y",
            nearestMrt: attraction.nearestMrtStation || "Not specified",
        }));
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Singapore Attractions</h1>

                        {/* 搜索框区域 */}
                        <div className="flex items-center gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Search for a Attractions..."
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {   
                                attractions.length > 0 ? (
                                    attractions.map((attraction) => (
                                    <AttractionCard key={attraction.uuid} attraction={attraction}/>
                                ))) : (
                                    <p className="text-center text-gray-600 mt-8 col-span-full">No matching Attractions were found.</p>
                                )
                            }
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
    )
};

export default AttractionPage;