import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import HotelPage from "../pages/hotel/HotelPage";
import HotelDetailPage from "../pages/hotel/HotelDetailPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelPage />} />
        <Route path="/hotelDetail" element={<HotelDetailPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
