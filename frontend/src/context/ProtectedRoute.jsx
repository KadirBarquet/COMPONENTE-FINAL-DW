import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';
import { Loader } from 'lucide-react';

// Componente para proteger rutas que requieren autenticación
export default function ProtectedRoute({ children, requiredRole = null }) {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene
    if (requiredRole) {
        // Convertir requiredRole a array si no lo es
        const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

        if (!requiredRoles.includes(currentUser?.role)) {
            // Redirigir según el rol del usuario
            if (currentUser?.role === 'admin') {
                return <Navigate to="/admin/users" replace />;
            } else if (currentUser?.role === 'teacher') {
                return <Navigate to="/teacher/surveys" replace />;
            } else {
                return <Navigate to="/student/surveys" replace />;
            }
        }
    }

    // Si todo está bien, renderizar el componente hijo
    return children;
}

// Componente de carga mientras se verifica la autenticación
export function LoadingRoute() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
                <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Verificando autenticación...</p>
            </div>
        </div>
    );
}

// Hook personalizado para verificar roles
export function useAuth() {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    const hasRole = (role) => {
        if (!currentUser) return false;
        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(currentUser.role);
    };

    const isAdmin = () => hasRole('admin');
    const isTeacher = () => hasRole(['teacher', 'admin']);
    const isStudent = () => hasRole(['student', 'admin']);

    return {
        isAuthenticated,
        currentUser,
        hasRole,
        isAdmin,
        isTeacher,
        isStudent
    };
}