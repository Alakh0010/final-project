import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual admin login logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Admin Login | Quick Query Resolver';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Quick Query Resolver Admin Panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm 
            onSubmit={handleLogin} 
            isLoading={isLoading} 
            isAdmin={true} 
          />
        </div>
        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to user login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
