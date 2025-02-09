// FlightResults.jsx
import { useNavigate } from 'react-router-dom';
import { FaPlaneDeparture, FaClock, FaDollarSign } from 'react-icons/fa';

const mockFlights = [
  {
    id: 1,
    airline: '中国国际航空',
    flightNo: 'CA1234',
    departure: '北京 (PEK) 08:00',
    arrival: '上海 (PVG) 10:30',
    duration: '2小时30分',
    price: 1200,
    stops: 0
  },
  {
    id: 2,
    airline: '东方航空',
    flightNo: 'MU5678',
    departure: '北京 (PEK) 10:30',
    arrival: '上海 (PVG) 13:00',
    duration: '2小时30分',
    price: 1100,
    stops: 1
  }
];

export default function FlightResults() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">搜索结果</h2>
      <div className="space-y-4">
        {mockFlights.map(flight => (
          <div 
            key={flight.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/detail/${flight.id}`)}
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
                    <span className="ml-2 text-orange-600">经停 {flight.stops} 站</span>
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
                    navigate(`/detail/${flight.id}`);
                  }}
                >
                  选择
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}