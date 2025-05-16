import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <h1>Quick Query Resolver</h1>
          <p>The fastest way to submit and track your queries</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-outline">Register</Link>
          </div>
        </div>
      </header>
      
      <section className="features">
        <div className="container">
          <h2>Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="icon">📝</div>
              <h3>Submit Queries</h3>
              <p>Easily submit and track your queries in one place</p>
            </div>
            <div className="feature-card">
              <div className="icon">⏱️</div>
              <h3>Fast Resolution</h3>
              <p>Get quick responses and solutions to your problems</p>
            </div>
            <div className="feature-card">
              <div className="icon">📊</div>
              <h3>Dashboard</h3>
              <p>Track all your queries in a visual dashboard</p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Quick Query Resolver</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
