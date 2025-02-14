import {} from "lucide-react"
import { useState, useEffect } from "react"

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Pagination from "../../components/common/Pagination";
import AttractionCard from "../../components/common/attraction/AttractionCard"
import { fetchAttraction, fetchReviewStatsByUUID } from "../../api/attractions";

const AttractionPage = () => {

    const [attractions, setAttraction] = useState([]) // save the data fetched from the api
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPages] = useState(0)

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
                            console.log(ratingResponse)
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
    
    useEffect(() => {
        getData();
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {   
                                attractions.length > 0 ? (attractions.map((attraction) => (
                                    <AttractionCard key={attraction.uuid} attraction={attraction}/>
                                ))) : (
                                    <p className="text-center text-gray-600 mt-8 col-span-full">No matching Attractions were found.</p>
                                )
                            }
                        </div>
                    <Pagination totalPages={totalPage} currentPage={currentPage} onPageChange={setCurrentPage} />
                </div>
            </main>
            <Footer />
        </div>
    )
};

export default AttractionPage;