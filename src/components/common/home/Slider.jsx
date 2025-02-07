import { useState } from "react";
import RecommendationCard from "./RecommendationCard";

const Slider = ({ title, items, visibleItems, isSidebarOpen }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log(items)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (items.length - visibleItems + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + (items.length - visibleItems + 1)) % (items.length - visibleItems + 1)
    );
  };
  

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className={`flex-shrink-0 transition-all duration-300`}
                style={{
                  width: `${100 / visibleItems}%`,
                  padding: isSidebarOpen ? "0 1rem" : "0 0.5rem",
                }}
              >
                <RecommendationCard item={item}/>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-0 z-10 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 font-bold py-4 px-3 rounded-r-full shadow"
        >
          &#8249;
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 font-bold py-4 px-3 rounded-l-full shadow"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
  

};

export default Slider;
