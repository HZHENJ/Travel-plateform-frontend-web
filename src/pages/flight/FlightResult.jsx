// FlightResults.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlaneDeparture, FaClock, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function FlightResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { from, to, date, passengers } = location.state || {};

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  useEffect(() => {
    axios.post(`${BACKEND_URL}/flights`, {
      from,
      to,
      date,
      passengers
    })
      .then(response => {
        const data = response.data.map(flight => ({
          id: flight.flightId,
          airline: flight.airline,
          flightNo: flight.flightNumber,
          departure: `${flight.departureCity} (${flight.departureAirport}) ${new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          arrival: `${flight.arrivalCity} (${flight.arrivalAirport}) ${new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          duration: flight.duration,
          price: flight.seatAvailability.Economy * 10, // Example: price calculated based on economy seats availability
          stops: flight.stops || 0
        }));
        setFlights(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [from, to, date, passengers]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">Error fetching flights!</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Result</h2>
        <div className="space-y-4">
          {flights.map(flight => (
            <div 
              key={flight.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/detail/${flight.id}`, { state: { passengers } })}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{flight.airline} {flight.flightNo}</h3>
                  <div className="mt-2 flex items-center text-gray-600">
                    <FaPlaneDeparture className="mr-2" />
                    <span>{flight.departure}</span>
                    <span className="mx-2">→</span>
                    <span>{flight.arrival}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FaClock className="mr-2" />
                    <span>{flight.duration}</span>
                    {flight.stops > 0 && (
                      <span className="ml-2 text-orange-600"> {flight.stops} Stop</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    <FaDollarSign className="inline mr-1" />{flight.price}
                  </p>
                  <button 
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/detail/${flight.id}`, { state: { passengers,price:Number(flight.price) } });
                    }}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
