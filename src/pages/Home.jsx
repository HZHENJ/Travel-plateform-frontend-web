import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Carousel from "../components/common/home/Carousel";
import Slider from "../components/common/home/Slider";
import Footer from "../components/layout/Footer";
import { fetchPersonalizedRecommendations, fetchPopularRecommendations, checkIfNewUser } from "../api/recommendations"

const Home = () => {
  const [visibleItems, setVisibleItems] = useState(3);

  const [famousAttractions, setFamousAttractions] = useState([]); // 著名景点
  const [recommendedAttractions, setRecommendedAttractions] = useState([]);
  const [isNewUser, setIsNewUser] = useState(true); // 是否为新用户
  const userId = parseInt(localStorage.getItem("userId"), 10);

  const getRecommendations = async () => {
    const famous = await fetchPopularRecommendations();
    setFamousAttractions(famous || []);
    
    if (userId) {
      // 检查是否为新用户
      const newUserStatus = await checkIfNewUser(userId);
      setIsNewUser(newUserStatus);

      // 只有老用户才获取个性化推荐
      if (!newUserStatus) {
        const personalized = await fetchPersonalizedRecommendations(userId);
        console.log(personalized)
        setRecommendedAttractions(personalized || []);
      }
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
                <Slider
                  title="Popular attractions"
                  items={famousAttractions}
                  visibleItems={visibleItems}
                />

                <Slider title="Personalized Recommendation" items={recommendedAttractions} visibleItems={visibleItems}/>

                {
                  userId && !isNewUser && (
                    <Slider title="Personalized Recommendation" items={recommendedAttractions}visibleItems={visibleItems}/>
                  )
                }
              </div>
            </div>
          </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
