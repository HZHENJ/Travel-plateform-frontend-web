import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Hotels from "../pages/hotel/HotelPage";
import HotelDetail from "../pages/hotel/HotelDetailPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotelDetail" element={<HotelDetail />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
