import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.form}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Welcome Back</h2>
          <p style={{ color: '#666' }}>Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <UserIcon style={{ position: 'absolute', left: '10px', height: '20px', width: '20px', color: '#666' }} />
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={styles.input}
                autoComplete="username"
                disabled={isLoading}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <LockClosedIcon style={{ position: 'absolute', left: '10px', height: '20px', width: '20px', color: '#666' }} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={styles.input}
                autoComplete="current-password"
                disabled={isLoading}
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {showPassword ? (
                  <EyeSlashIcon style={{ height: '20px', width: '20px' }} />
                ) : (
                  <EyeIcon style={{ height: '20px', width: '20px' }} />
                )}
              </button>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className={styles.spinner}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '8px',
                    animation: 'spin 1s linear infinite'
                  }}
                >
                  <circle
                    className={styles.spinnerCircle}
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    style={{
                      strokeDasharray: '31.4',
                      strokeDashoffset: '15.7',
                      strokeLinecap: 'round'
                    }}
                  />
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div style={{ margin: '1.5rem 0', textAlign: 'center', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: '#eaeaea',
              zIndex: 1
            }} />
            <span style={{
              position: 'relative',
              zIndex: 2,
              backgroundColor: 'white',
              padding: '0 1rem',
              color: '#666',
              fontSize: '0.9rem'
            }}>
              or
            </span>
          </div>

          <Link 
            to="/admin-login" 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              border: '1px solid #eaeaea',
              borderRadius: '4px',
              backgroundColor: 'white',
              color: '#333',
              textDecoration: 'none',
              marginTop: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f8f8';
              e.currentTarget.style.borderColor = '#ddd';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#eaeaea';
            }}
          >
            <ShieldCheckIcon style={{ height: '20px', width: '20px' }} />
            Admin Portal
          </Link>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            © {new Date().getFullYear()} Quick Query Resolver. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;