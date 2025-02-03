import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import HotelPage from "../pages/hotel/HotelPage";
import HotelDetailPage from "../pages/hotel/HotelDetailPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Hotel Router */}
        <Route path="/hotels" element={<HotelPage />} />
        <Route path="/hotels/:uuid" element={<HotelDetailPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
