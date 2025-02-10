// FlightDetail.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { FaChair, FaUtensils, FaWifi, FaPlane } from 'react-icons/fa';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const flightDetails = {
  1: {
    airline: 'Air China',
    aircraft: 'Boeing 737-800',
    amenities: ['wifi', 'meal', 'extra-legroom'],
    baggage: '23kg free baggage allowance',
    departureGate: 'A12',
    arrivalTerminal: 'T2'
  }
};

export default function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const details = flightDetails[id];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">Flight Details</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Airline:</span> {details.airline}</p>
                  <p><span className="font-medium">Aircraft:</span> {details.aircraft}</p>
                  <p><span className="font-medium">Baggage Allowance:</span> {details.baggage}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Amenities & Services</h3>
                <div className="flex space-x-4">
                  {details.amenities.includes('wifi') && (
                    <div className="flex items-center">
                      <FaWifi className="text-blue-500 mr-1" /> WiFi
                    </div>
                  )}
                  {details.amenities.includes('meal') && (
                    <div className="flex items-center">
                      <FaUtensils className="text-green-500 mr-1" /> Meal
                    </div>
                  )}
                  <div className="flex items-center">
                    <FaChair className="text-purple-500 mr-1" /> Comfortable Seat
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Itinerary Information</h3>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Departure: Beijing Capital International Airport (PEK)</p>
                  <p className="text-sm">Gate: {details.departureGate}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center">
                    <FaPlane className="text-blue-500 text-xl" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Arrival: Shanghai Pudong International Airport (PVG)</p>
                  <p className="text-sm">Terminal: {details.arrivalTerminal}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/seating')}
              className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 w-full transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
