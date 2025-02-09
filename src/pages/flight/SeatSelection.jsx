// SeatSelection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const generateSeats = () => {
  const rows = [];
  for (let i = 1; i <= 10; i++) {
    const row = [];
    for (let j = 1; j <= 6; j++) {
      row.push({
        id: `${i}-${String.fromCharCode(64 + j)}`,
        available: Math.random() > 0.3
      });
    }   
    rows.push(row);
  }
  return rows;
};

export default function SeatSelection() {
  const [seats] = useState(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  const toggleSeat = (seatId) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId) 
        : [...prev, seatId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">选择座位</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-8">
          <div className="w-full h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-600">驾驶舱</span>
          </div>
          
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-4 mb-4">
              {row.map((seat, seatIndex) => (
                <button
                  key={seat.id}
                  onClick={() => seat.available && toggleSeat(seat.id)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center
                    ${seat.available 
                      ? selectedSeats.includes(seat.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-blue-200'
                      : 'bg-red-200 cursor-not-allowed'}
                    ${seatIndex === 2 && 'mr-8'}`}
                  disabled={!seat.available}
                >
                  {seat.id.split('-')[1]}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">已选座位：</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map(seat => (
              <span key={seat} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                {seat}
              </span>
            ))}
            {selectedSeats.length === 0 && <span className="text-gray-500">尚未选择座位</span>}
          </div>
        </div>

        <button
          onClick={() => navigate('/payment')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 w-full transition-colors"
          disabled={selectedSeats.length === 0}
        >
          确认座位 ({selectedSeats.length}个)
        </button>
      </div>
    </div>
  );
}