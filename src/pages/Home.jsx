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
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(1);
      } else if (width < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(isSidebarOpen ? 3 : 4);
      }
    };

    getRecommendations();

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen, userId]);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

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
              <div className={`lg:flex-grow overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "lg:w-3/4 lg:pr-6" : "lg:w-full lg:pr-4"} relative`}
                style={{ height: "calc(100vh - 64px - 500px)" }}
              >
                {/* <Slider
                  title="推荐酒店"
                  items={recommendedHotels}
                  visibleItems={visibleItems}
                  isSidebarOpen={isSidebarOpen}
                /> */}
                <Slider
                  title="Popular attractions"
                  items={recommendedAttractions}
                  visibleItems={visibleItems}
                  isSidebarOpen={isSidebarOpen}
                />
              </div>
              {/* <CollapsibleSidebar onToggle={handleSidebarToggle}>
                <div className="space-y-4 overflow-y-auto" style={{ height: "calc(100vh - 64px - 500px)" }}>
                  <Collapsible title="新加坡旅游小贴士">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <svg
                          className="w-6 h-6 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span>随身携带足够的现金和信用卡</span>
                      </li>
                    </ul>
                  </Collapsible>
                </div>
              </CollapsibleSidebar> */}
            </div>
          </div>
          {/* <FeatureSection />
          <Newsletter /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
