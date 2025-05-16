import React, { useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiBell } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const iconMap = {
  success: <FiCheckCircle className="text-green-500" />,
  error: <FiAlertCircle className="text-red-500" />,
  info: <FiInfo className="text-blue-500" />,
  warning: <FiBell className="text-yellow-500" />,
};

export const ToastNotification: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`fixed bottom-4 right-4 flex items-center justify-between p-4 rounded-lg shadow-lg bg-white border-l-4 ${
        type === 'success' ? 'border-green-500' :
        type === 'error' ? 'border-red-500' :
        type === 'warning' ? 'border-yellow-500' :
        'border-blue-500'
      }`}
      style={{ minWidth: '300px', zIndex: 1000 }}
    >
      <div className="flex items-start">
        <div className="text-xl mr-3 mt-0.5">
          {iconMap[type]}
        </div>
        <div>
          <p className="font-medium text-gray-800">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Close notification"
      >
        <FiX />
      </button>
    </div>
  );
};

// Toast context and provider
type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
