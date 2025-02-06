import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ToastProvider } from '../components/common/MessageBox'
import Home from "../pages/Home";
import SigninPage from "../pages/SigninPage"
import SignupPage from "../pages/SignupPage"
import HotelPage from "../pages/hotel/HotelPage";
import HotelDetailPage from "../pages/hotel/HotelDetailPage";
import AttractionDetailPage from "../pages/attraction/AttractionDetailPage";

import AttractionPage from "../pages/attraction/AttractionPage"

const AppRoutes = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* ongly not login can vist */}
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* Hotel Router */}
          <Route path="/hotels" element={<HotelPage />} />
          <Route path="/hotels/:uuid" element={<HotelDetailPage />} />

          {/* Attraction Router */}
          <Route path="/attractions" element={<AttractionPage />}/>
          <Route path="/attractions/:uuid" element={<AttractionDetailPage />}/>
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default AppRoutes;
