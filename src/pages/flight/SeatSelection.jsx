import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const generateSeats = () => {
  const rows = [];
  for (let i = 1; i <= 10; i++) {
    const row = [];
    for (let j = 1; j <= 6; j++) {
      row.push({
        id: `${i}-${String.fromCharCode(64 + j)}`,
        available: Math.random() > 0.3, 
      });
    }
    rows.push(row);
  }
  return rows;
};

export default function SeatSelection() {
  const type = 'Flight';
  const navigate = useNavigate();
  const location = useLocation();
  const { id, passengers,price } = location.state || {};  
  const maxSeats = passengers || 0;  
  const [seats] = useState(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);

  const totalprice = price * passengers

  useEffect(() => {
    setSelectedSeats([]);
  }, [passengers]);

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else if (selectedSeats.length < maxSeats) {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  return (

    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
         <div className="max-w-5xl mx-auto p-8 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-8 text-blue-600 text-center">Select Your Seats</h2>
        <div className="mb-12">
          <div className="w-full h-16 bg-blue-200 rounded-lg mb-8 flex items-center justify-center">
            <span className="text-gray-600 text-xl">Seat Layout</span>
          </div>

          {/* Seat Rows */}
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-8 items-center space-x-4">  {/* space-x-4 adds space between seats */}
              <div className="w-12 flex items-center justify-center font-semibold text-gray-600">{rowIndex + 1}</div>
              
              {/* Left seats */}
              {row.slice(0, 3).map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => seat.available && toggleSeat(seat.id)}
                  className={`w-14 h-14 rounded-lg flex items-center justify-center text-lg
                    ${seat.available
                      ? selectedSeats.includes(seat.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-blue-200 border-2 border-blue-300'
                      : 'bg-red-300 cursor-not-allowed'}`}
                  disabled={!seat.available}
                >
                  {seat.id.split('-')[1]}
                </button>
              ))}

              {/* Aisle */}
              <div className="w-10 flex items-center justify-center text-gray-400">|</div>

              {/* Right seats */}
              {row.slice(3).map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => seat.available && toggleSeat(seat.id)}
                  className={`w-14 h-14 rounded-lg flex items-center justify-center text-lg
                    ${seat.available
                      ? selectedSeats.includes(seat.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-blue-200 border-2 border-blue-300'
                      : 'bg-red-300 cursor-not-allowed'}`}
                  disabled={!seat.available}
                >
                  {seat.id.split('-')[1]}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="bg-blue-100 p-6 rounded-lg mb-8">
          <h3 className="font-semibold text-lg mb-4">Selected Seats:</h3>
          <div className="flex flex-wrap gap-4">
            {selectedSeats.map(seat => (
              <span key={seat} className="bg-blue-200 text-blue-800 px-4 py-2 rounded-lg text-lg">
                {seat}
              </span>
            ))}
            {selectedSeats.length === 0 && <span className="text-gray-500">No seats selected yet</span>}
          </div>
        </div>

        <button
          onClick={() => navigate('/payment', { state: { selectedSeats,id,type,totalprice } })}
          className="bg-blue-600 text-white px-10 py-4 rounded-lg hover:bg-blue-700 w-full transition-colors"
          disabled={selectedSeats.length === 0}
        >
          Confirm Seats ({selectedSeats.length} seats)
        </button>
      </div>
    </div>
    <Footer/>
    </div>
  );
}
