// Confirmation.jsx
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Confirmation() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">Thank you for your payment, your transaction has been successfully processed.</p>
        
        <button
          onClick={handleBackToHome}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
