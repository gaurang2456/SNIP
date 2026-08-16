import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface font-body-md text-on-surface">
        <Navbar />
        <main className="w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/urls" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/analytics/:id" element={<AnalyticsPage />} />
          </Routes>
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1b1b1b',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              padding: '10px 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ba1a1a', secondary: '#ffffff' },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
