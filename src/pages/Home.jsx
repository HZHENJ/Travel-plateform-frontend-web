import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Carousel from "../components/common/home/Carousel";
import Slider from "../components/common/home/Slider";
import Collapsible from "../components/common/home/Collapsible";
import CollapsibleSidebar from "../components/common/home/CollapsibleSidebar";
import FeatureSection from "../components/common/home/FeatureSection";
import Newsletter from "../components/common/home/Newsletter";
import Footer from "../components/layout/Footer";
// import MessageSection from "../components/common/MessageSection";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3);

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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const carouselImages = [
    "/placeholder.svg?height=500&width=1500&text=新加坡城市天际线",
    "/placeholder.svg?height=500&width=1500&text=圣淘沙岛风光",
    "/placeholder.svg?height=500&width=1500&text=滨海湾花园",
  ];

  const recommendedHotels = [
    {
      image: "/placeholder.svg?height=200&width=300&text=滨海湾金沙酒店",
      title: "滨海湾金沙酒店",
      description: "豪华五星级酒店，拥有无边泳池和壮观的城市景观。",
      price: "￥1,500/晚",
      rating: "4.8",
    },
    {
      image: "/placeholder.svg?height=200&width=300&text=圣淘沙名胜世界硬石酒店",
      title: "圣淘沙名胜世界硬石酒店",
      description: "位于圣淘沙岛上的现代化度假酒店，靠近环球影城。",
      price: "￥1,200/晚",
      rating: "4.6",
    },
    {
      image: "/placeholder.svg?height=200&width=300&text=新加坡丽思卡尔顿美年酒店",
      title: "新加坡丽思卡尔顿美年酒店",
      description: "位于市中心的奢华酒店，提供顶级服务和设施。",
      price: "￥1,800/晚",
      rating: "4.9",
    },
    {
      image: "/placeholder.svg?height=200&width=300&text=新加坡文华东方酒店",
      title: "新加坡文华东方酒店",
      description: "坐落于滨海湾，提供优雅的住宿和米其林星级餐厅。",
      price: "￥1,600/晚",
      rating: "4.7",
    },
    {
      image: "/placeholder.svg?height=200&width=300&text=新加坡富丽敦酒店",
      title: "新加坡富丽敦酒店",
      description: "位于新加坡河畔的标志性殖民地风格酒店。",
      price: "￥1,400/晚",
      rating: "4.8",
    },
    {
      image: "/placeholder.svg?height=200&width=300&text=新加坡洲际酒店",
      title: "新加坡洲际酒店",
      description: "位于商业区的豪华酒店，拥有顶级设施和服务。",
      price: "￥1,700/晚",
      rating: "4.7",
    },
  ]

  const recommendedAttractions = [
    {
      image: "/placeholder.svg?height=200&width=300&text=新加坡环球影城",
      title: "新加坡环球影城",
      description: "东南亚首个环球影城主题公园，拥有多个刺激的游乐设施。",
      price: "￥300/人",
      rating: "4.7",
    },
    {
      image: "/placeholder.svg?height=200&width=300&text=滨海湾花园",
      title: "滨海湾花园",
      description: "壮观的自然公园，拥有超级树和云雾林等独特景观。",
      price: "￥120/人",
      rating: "4.8",
    },
    {
      image: "/placeholder.svg?height=200&width=300&text=新加坡动物园",
      title: "新加坡动物园",
      description: "世界知名的开放式动物园，可以近距离观察各种野生动物。",
      price: "￥180/人",
      rating: "4.6",
    },
    {
      image: "/placeholder.svg?height=200&width=300&text=圣淘沙岛",
      title: "圣淘沙岛",
      description: "著名的度假岛屿，拥有美丽的海滩和各种娱乐设施。",
      price: "￥50/人",
      rating: "4.5",
    },
    {
      image: "/placeholder.svg?height=200&width=300&text=国家美术馆",
      title: "国家美术馆",
      description: "新加坡最大的视觉艺术场所，展示新加坡和东南亚艺术。",
      price: "￥80/人",
      rating: "4.4",
    },
    {
      image: "/placeholder.svg?height=200&width=300&text=新加坡植物园",
      title: "新加坡植物园",
      description: "拥有150多年历史的热带花园，是联合国教科文组织世界遗产。",
      price: "免费",
      rating: "4.5",
    },
  ]

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
                <Slider
                  title="推荐酒店"
                  items={recommendedHotels}
                  visibleItems={visibleItems}
                  isSidebarOpen={isSidebarOpen}
                />
                <Slider
                  title="热门景点"
                  items={recommendedAttractions}
                  visibleItems={visibleItems}
                  isSidebarOpen={isSidebarOpen}
                />
              </div>
              <CollapsibleSidebar onToggle={handleSidebarToggle}>
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
              </CollapsibleSidebar>
            </div>
          </div>
          <FeatureSection />
          <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
