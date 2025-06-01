import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import POS from './pages/POS';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { useAppSelector } from './store/hooks';
import { selectAuth } from './store/slices/authSlice';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(selectAuth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login\" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<POS />} />
        
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />
        
        <Route path="sales" element={
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;