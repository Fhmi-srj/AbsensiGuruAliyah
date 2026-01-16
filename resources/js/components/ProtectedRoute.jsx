import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, roles = [], requiredRoles = [] }) {
    const { isAuthenticated, loading, hasRole, user } = useAuth();
    const location = useLocation();

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-green-600 text-3xl mb-3"></i>
                    <p className="text-gray-500 text-sm">Memuat...</p>
                </div>
            </div>
        );
    }

    // Not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Combine roles and requiredRoles for backward compatibility
    const allRequiredRoles = [...roles, ...requiredRoles];

    // Check role if specified
    if (allRequiredRoles.length > 0 && !hasRole(...allRequiredRoles)) {
        // Redirect to appropriate dashboard based on user role
        if (user?.role === 'guru' && !location.pathname.startsWith('/guru')) {
            return <Navigate to="/guru" replace />;
        }
        if (user?.role === 'superadmin' && location.pathname.startsWith('/guru')) {
            return <Navigate to="/dashboard" replace />;
        }

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <i className="fas fa-lock text-red-500 text-4xl mb-3"></i>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Akses Ditolak</h2>
                    <p className="text-gray-500 text-sm">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                </div>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;
