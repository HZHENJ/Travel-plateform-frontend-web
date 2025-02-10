// Payment.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaCalendar, FaLock } from 'react-icons/fa';

export default function Payment() {
  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardHolder: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/confirmation');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Payment Information</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Cardholder Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Must match card name"
              value={payment.cardHolder}
              onChange={(e) => setPayment({ ...payment, cardHolder: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Credit Card Number</label>
            <div className="relative">
              <FaCreditCard className="absolute top-4 left-3 text-gray-400" />
              <input
                type="text"
                pattern="\d*"
                className="w-full pl-10 p-3 border rounded-lg"
                placeholder="1234 5678 9012 3456"
                maxLength="16"
                value={payment.cardNumber}
                onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Expiry Date</label>
              <div className="relative">
                <FaCalendar className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="MM/YY"
                  value={payment.expiry}
                  onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Security Code</label>
              <div className="relative">
                <FaLock className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="text"
                  pattern="\d*"
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="CVC"
                  maxLength="3"
                  value={payment.cvv}
                  onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Payment Amount</h3>
          <p className="text-2xl font-bold text-blue-600">$ 1200.00</p>
        </div>

        <button
          type="submit"
          className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 w-full transition-colors"
        >
          Confirm Payment
        </button>
      </form>
    </div>
  );
}
