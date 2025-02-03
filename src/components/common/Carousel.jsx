import { useState, useEffect } from "react";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-[500px] overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={image || "/placeholder.svg"} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">探索新加坡</h2>
              <p className="text-xl md:text-2xl mb-8">体验狮城的魅力与活力</p>
              <a
                href="#"
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
              >
                开始规划
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
