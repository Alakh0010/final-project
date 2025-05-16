import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import main pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import QueryPage from './pages/QueryPage';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/query/:id" element={<QueryPage />} />
      </Routes>
    </div>
  );
}

export default App;
