import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? <Navigate to="/" replace /> : children;
};

const AppRoutes = () => (
  <>
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute><><Navbar /><Transactions /></></PrivateRoute>} />
      <Route path="/add" element={<PrivateRoute><><Navbar /><AddTransaction /></></PrivateRoute>} />
      <Route path="/edit/:id" element={<PrivateRoute><><Navbar /><AddTransaction /></></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><><Navbar /><Profile /></></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <TransactionProvider>
          <AppRoutes />
        </TransactionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
