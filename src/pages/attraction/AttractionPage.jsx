import {} from "lucide-react"
import { useState, useEffect } from "react"

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Pagination from "../../components/common/Pagination";
import AttractionCard from "../../components/common/attraction/AttractionCard"
import { fetchAttraction, getAttractionRating } from "../../api/attractions";

const AttractionPage = () => {

    const [attractions, setAttraction] = useState([]) // save the data fetched from the api
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPages] = useState(0)

    const attractionPrePage = 6
    const offset = (currentPage - 1) * attractionPrePage

    // fetched attraction data from api
    const getData = async () => {
        try {
            const response = await fetchAttraction(offset, attractionPrePage)
            console.log("API Data:", response.data);
            if (response && response.data) {
                // transform the data 
                const newAttractions = transformAttractions(response.data.data)

                const res_Rating = await Promise.all(newAttractions.map(attraction => getAttractionRating(attraction.uuid)))

                newAttractions.map((attraction, index) => ({
                    ...attraction,
                    rating: res_Rating[index] || attraction.rating
                }))
                setAttraction(newAttractions);
                // console.log("Attractions", newAttractions)
                // get total pages
                setTotalPages(Math.ceil(response.data.totalRecords / attractionPrePage));
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    //  
    useEffect(() => {
        getData();
    }, [currentPage])

    console.log("attractions", attractions)

    // parse the data from the api
    const transformAttractions = (data) => {
        return data.map((attraction) => ({
            uuid: attraction.uuid,
            name: attraction.name || "Unknow Hotel",
            address: attraction.address ? `${attraction.address.block || ""} ${attraction.address.streetName || ""}, ${attraction.address.postalCode || ""}`: "Unknow address",
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
            rating: attraction.rating || 0,
            image: (attraction.thumbnails && attraction.thumbnails.length > 0) ? attraction.thumbnails[0].uuid: "101bc4fab99f6d6476d9fc609a50c20ebc6", 
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