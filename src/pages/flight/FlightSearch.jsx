// FlightSearch.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlane, FaCalendarAlt, FaUser } from 'react-icons/fa';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function FlightSearch() {
  const [form, setForm] = useState({ 
    from: '', 
    to: '', 
    date: '', 
    passengers: 1 
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/results', { state: form });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-3xl font-bold mb-8 text-blue-600">Search Flight</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">出发地</label>
                <div className="relative">
                  <FaPlane className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    className="pl-10 p-2 border rounded w-full"
                    placeholder="例如：北京"
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">目的地</label>
                <div className="relative">
                  <FaPlane className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    className="pl-10 p-2 border rounded w-full"
                    placeholder="例如：上海"
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">出发日期</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="date"
                    className="pl-10 p-2 border rounded w-full"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">乘客</label>
                <div className="relative">
                  <FaUser className="absolute top-3 left-3 text-gray-400" />
                  <select
                    className="pl-10 p-2 border rounded w-full"
                    value={form.passengers}
                    onChange={(e) => setForm({ ...form, passengers: e.target.value })}
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} 人</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full transition-colors"
            >
              搜索航班
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};