import React from 'react';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiBell,
  FiX 
} from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const ToastNotification: React.FC<ToastProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      case 'info':
        return <FiInfo className="text-blue-500" />;
      case 'warning':
        return <FiBell className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      case 'info':
        return 'bg-blue-100';
      case 'warning':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-4 ${getBgColor()}`}
      role="alert"
    >
      <div className="text-xl">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </p>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700"
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
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(toast => (
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
