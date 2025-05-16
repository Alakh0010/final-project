import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import styles from './SuccessPage.module.css';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.card}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={styles.iconWrapper}
        >
          <CheckCircleIcon className={styles.icon} />
        </motion.div>

        <h1 className={styles.title}>Query Submitted Successfully!</h1>
        <p className={styles.message}>
          Your query has been received. We&apos;ll get back to you soon. Thank you for your submission. Our team will review your query and get back to you within 24 hours.
        </p>

        <div className={styles.actions}>
          <button
            onClick={() => navigate('/')}
            className={styles.submitAnotherButton}
          >
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