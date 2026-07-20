import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from './AdminDashboard';

const AdminWrapper = () => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default AdminWrapper;
