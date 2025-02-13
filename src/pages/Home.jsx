import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Carousel from "../components/common/home/Carousel";
import Slider from "../components/common/home/Slider";
import Footer from "../components/layout/Footer";
import { fetchPersonalizedRecommendations } from "../api/recommendations"

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3);

  const [recommendedAttractions, setRecommendedAttractions] = useState([]);
  const userId = parseInt(localStorage.getItem("userId"), 10);

  const getRecommendations = async () => {
    if (userId) {
      const recommendations = await fetchPersonalizedRecommendations(userId);
      setRecommendedAttractions(recommendations);
    }
  };

  useEffect(() => {
    getRecommendations();
  }, [userId]);

  const carouselImages = [
    "/images/01.jpg",
    "/images/02.jpg",
    "/images/03.jpg",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Carousel images={carouselImages} />
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:flex-grow overflow-y-auto transition-all duration-300 lg:w-full lg:pr-4 relative">
                {/* <Slider
                  title="推荐酒店"
                  items={recommendedHotels}
                  visibleItems={visibleItems}
                /> */}
                <Slider
                  title="Popular attractions"
                  items={recommendedAttractions}
                  visibleItems={visibleItems}
                />
              </div>
            </div>
          </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
