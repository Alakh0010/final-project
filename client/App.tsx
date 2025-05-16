import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Import pages
// These will be created later when we move the pages from src to client
const Home = () => <div>Home Page</div>;
const Login = () => <div>Login Page</div>;
const Dashboard = () => <div>Dashboard Page</div>;

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
