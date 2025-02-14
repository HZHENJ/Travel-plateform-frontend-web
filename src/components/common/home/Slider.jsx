import { useState } from "react";
import RecommendationCard from "./RecommendationCard";

const Slider = ({ title, items, visibleItems, isSidebarOpen }) => {
  if (!items || items.length === 0) return null;
  const [currentIndex, setCurrentIndex] = useState(0);

  // console.log(items)
  const totalItems = items.length;
  const maxIndex = Math.max(0, totalItems - visibleItems);

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };
  

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="relative z-10">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 transition-all duration-300 px-2"
              style={{ width: `${100 / visibleItems}%` }}
            >
              <RecommendationCard item={item}/>
            </div>
          ))}
        </div>

        {totalItems > visibleItems && (
          <>
            {/* 左滑按钮 */}
            {currentIndex > 0 && (
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-0 z-10 transform -translate-y-1/2 bg-gray-700 bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-3 px-4 rounded-r-full shadow-lg transition duration-200"
              >
                &#8249;
              </button>
            )}

            {/* 右滑按钮 */}
            {currentIndex < maxIndex && (
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2 bg-gray-700 bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-3 px-4 rounded-l-full shadow-lg transition duration-200"
              >
                &#8250;
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
  

};

export default Slider;
