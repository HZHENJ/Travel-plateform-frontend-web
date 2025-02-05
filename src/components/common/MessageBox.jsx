// Author
// HUANG ZHENJIA A0298312B

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

// set context - no need to use props to trans the data
const ToastContext = createContext();

// set icon and type
const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5" />;
    case 'error':
      return <XCircle className="w-5 h-5" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <Info className="w-5 h-5" />;
  }
};

// Toast components
const Toast = ({ message, type, onClose }) => {
  const toastStyles = {
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
  };

  return (
    <div className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-lg ${toastStyles[type]}`}>
      <ToastIcon type={type} />
      <p>{message}</p>
    </div>
  );
};

// core component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // show message box function
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    setTimeout(() => {setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));}, duration);
  }, []);

  // hide message box function
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // 
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)}/>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Customized hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};