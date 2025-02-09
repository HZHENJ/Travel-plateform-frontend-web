import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ToastProvider } from '../components/common/MessageBox'
import Home from "../pages/Home";
import SigninPage from "../pages/SigninPage"
import SignupPage from "../pages/SignupPage"
import HotelPage from "../pages/hotel/HotelPage";
import HotelDetailPage from "../pages/hotel/HotelDetailPage";
import AttractionDetailPage from "../pages/attraction/AttractionDetailPage";
import AttractionPage from "../pages/attraction/AttractionPage"
import SchedulePage from "../pages/schedule/SchedulePage";
import FlightSearch from "../pages/flight/FlightSearch";
import FlightResults from "@/pages/flight/FlightResult";
import FlightDetail from "@/pages/flight/FlightDetails";
import SeatSelection from "@/pages/flight/SeatSelection";
import Payment from "@/pages/flight/Payment";
import Confirmation from "@/pages/flight/Confirmation";


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

          {/* schedule */}
          <Route path="/schedule" element={<SchedulePage />}/>

          {/* flight */}
          <Route path="/flight" element={<FlightSearch />}/>
          <Route path="/results" element={<FlightResults />}/>
          <Route path="/detail/:id" element={<FlightDetail />}/>
          <Route path="/seating" element={<SeatSelection />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation/>} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default AppRoutes;
