import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  UserIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
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
      setError('Invalid email or password&apos;s');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className="wallpaper wallpaper-1"></div>
      <div className="wallpaper wallpaper-2"></div>
      <div className="wallpaper wallpaper-3"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.loginContainer}
      >
        <div className={styles.loginHeader}>
          <div className={styles.iconWrapper}>
            <UserIcon className={styles.icon} />
          </div>
          <h2>Quick Query Resolver</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <div className={styles.inputWrapper}>
              <UserIcon className={styles.inputIcon} />
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={styles.inputField}
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <LockClosedIcon className={styles.inputIcon} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={styles.inputField}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeSlashIcon className={styles.toggleIcon} />
                ) : (
                  <EyeIcon className={styles.toggleIcon} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.errorMessage}
            >
              <svg
                className={styles.errorIcon}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className={styles.spinner}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className={styles.spinnerCircle}
                    cx="12"
                    cy="12"
                    r="10"
                  ></circle>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <Link to="/admin-login" className={styles.adminButton}>
            <ShieldCheckIcon className={styles.adminIcon} />
            Admin Portal
          </Link>
        </form>

        <p className={styles.signupText}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className={styles.signupLink}>
            Create one now
          </Link>
        </p>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} Quick Query Resolver. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Login; 