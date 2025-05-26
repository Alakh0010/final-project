import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, loading, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm onSubmit={handleLogin} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Login;
