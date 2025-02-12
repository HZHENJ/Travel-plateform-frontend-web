import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaClock } from 'react-icons/fa';
import axios from 'axios';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { passengers,price } = location.state || {};  // Get passengers data from the previous page

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    axios.get(`http://localhost:8080/api/flights/${id}`)
      .then(response => {
        const flight = response.data;
        const formattedDetails = {
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          departureCity: flight.departureCity,
          arrivalCity: flight.arrivalCity,
          departureAirport: flight.departureAirport,
          arrivalAirport: flight.arrivalAirport,
          departureTime: new Date(flight.departureTime).toLocaleString(),
          arrivalTime: new Date(flight.arrivalTime).toLocaleString(),
          duration: flight.duration,
          flightStatus: flight.flightStatus,
        };
        setDetails(formattedDetails);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">Error loading flight details!</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-10">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-4xl font-semibold mb-8 text-indigo-600">Flight Details</h2>

          {/* Flight Information */}
          <div className="space-y-8">
            <div className="flex justify-between gap-6">
              <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Flight Information</h3>
                <p className="text-gray-600"><strong>Airline:</strong> {details.airline}</p>
                <p className="text-gray-600"><strong>Flight Number:</strong> {details.flightNumber}</p>
              </div>

              <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Departure & Arrival</h3>
                <p className="text-gray-600"><strong>Departure:</strong> {details.departureCity} ({details.departureAirport})</p>
                <p className="text-gray-600"><strong>Arrival:</strong> {details.arrivalCity} ({details.arrivalAirport})</p>
              </div>
            </div>

            <div className="flex justify-between gap-6">
              <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-sm">
                <p className="text-gray-600"><strong>Departure Time:</strong> {details.departureTime}</p>
                <p className="text-gray-600"><strong>Arrival Time:</strong> {details.arrivalTime}</p>
              </div>

              <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-sm">
                <p className="text-gray-600"><strong>Duration:</strong> {details.duration}</p>
                {details.flightStatus && (
                  <p className="text-gray-600">
                    <strong>Status:</strong> 
                    <span className={`px-3 py-1 rounded-full text-sm ${details.flightStatus === 'Scheduled' ? 'bg-green-200 text-green-700' : details.flightStatus === 'Delayed' ? 'bg-yellow-200 text-yellow-700' : 'bg-red-200 text-red-700'}`}>
                      {details.flightStatus}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Flight Itinerary */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-semibold mb-6">Flight Itinerary</h3>
            <div className="flex justify-between items-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="flex flex-col items-center">
                <FaPlaneDeparture className="text-blue-500 text-3xl mb-3" />
                <p className="font-medium text-lg">{details.departureCity}</p>
                <p className="text-sm text-gray-600">{details.departureAirport}</p>
                <p className="text-blue-600 font-medium">{details.departureTime}</p>
              </div>

              <div className="text-center mx-4">
                <div className="w-20 h-20 border-2 border-blue-500 rounded-full flex items-center justify-center">
                  <FaClock className="text-blue-500 text-2xl" />
                </div>
                <p className="text-sm mt-2">{details.duration}</p>
              </div>

              <div className="flex flex-col items-center">
                <FaPlaneArrival className="text-blue-500 text-3xl mb-3" />
                <p className="font-medium text-lg">{details.arrivalCity}</p>
                <p className="text-sm text-gray-600">{details.arrivalAirport}</p>
                <p className="text-blue-600 font-medium">{details.arrivalTime}</p>
              </div>
            </div>
          </div>

          <button
          onClick={() => navigate('/seating', { state: { id, passengers, price} })}

            className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 w-full transition-colors"
          >
            Proceed to Seat Selection
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
