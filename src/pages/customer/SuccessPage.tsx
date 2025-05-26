import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ArrowRightIcon, 
  DocumentDuplicateIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

interface SuccessPageState {
  message?: string;
  queryId?: string;
}
import styles from './SuccessPage.module.css';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const state = location.state as SuccessPageState | undefined;
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const defaultMessage = 'Your query has been received. We\'ll get back to you soon.';
  const message = state?.message || defaultMessage;
  const queryId = state?.queryId;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // You can add a toast notification here if you want
        console.log('Copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>QuickQueryResolver</h1>
          <button 
            onClick={handleLogout} 
            className={styles.logoutButton}
            title="Logout"
          >
            <ArrowLeftOnRectangleIcon className={styles.logoutIcon} />
            <span>Logout</span>
          </button>
        </div>
      </header>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.card}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={styles.iconWrapper}
        >
          <CheckCircleIcon className={styles.icon} />
        </motion.div>

        <h1 className={styles.title}>Query Submitted Successfully!</h1>
        <p className={styles.message}>
          {message}
        </p>
        
        {queryId && (
          <div className={styles.queryIdContainer}>
            <span className={styles.queryIdLabel}>Query ID:</span>
            <div className={styles.queryIdWrapper}>
              <code className={styles.queryId}>{queryId}</code>
              <button 
                onClick={() => copyToClipboard(queryId)}
                className={styles.copyButton}
                title="Copy to clipboard"
              >
                <DocumentDuplicateIcon className={styles.copyIcon} />
              </button>
            </div>
            <p className={styles.note}>
              Please keep this ID for future reference.
            </p>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={() => navigate('/')} className={styles.submitAnotherButton}>
            Submit Another Query
            <ArrowRightIcon className={styles.arrowIcon} />
          </button>
        </div>

        <div className={styles.infoSection}>
          <h2>What happens next?</h2>
          <ul className={styles.steps}>
            <li>
              <span className={styles.stepNumber}>1</span>
              <div className={styles.stepContent}>
                <h3>Review Process</h3>
                <p>Our team will review your query and categorize it based on priority.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>2</span>
              <div className={styles.stepContent}>
                <h3>Response Time</h3>
                <p>You&apos;ll receive an initial response within 24 hours.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>3</span>
              <div className={styles.stepContent}>
                <h3>Resolution</h3>
                <p>We&apos;ll work with you to resolve your query as quickly as possible.</p>
              </div>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
