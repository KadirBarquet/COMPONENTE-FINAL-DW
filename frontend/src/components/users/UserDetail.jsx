import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    User as UserIcon,
    Mail,
    Shield,
    Calendar,
    ArrowLeft,
    Edit2,
    Loader,
    AlertCircle,
    UserCheck,
    GraduationCap
} from 'lucide-react';
import userService from '../../services/userService';
import authService from '../../services/authService';

export default function UserDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const currentUser = authService.getCurrentUser();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUserData();
    }, [id]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const response = await userService.getById(id);
            setUser(response.user);
        } catch (err) {
            setError(err.message || 'Error al cargar los datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield className="w-6 h-6" />;
            case 'teacher': return <GraduationCap className="w-6 h-6" />;
            default: return <UserCheck className="w-6 h-6" />;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800 border-red-200';
            case 'teacher': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'teacher': return 'Profesor';
            default: return 'Estudiante';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando datos del usuario...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div className="bg-primary p-3 rounded-lg">
                                <UserIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Detalles del Usuario</h1>
                                <p className="text-gray-600">Información completa del usuario</p>
                            </div>
                        </div>
                        {currentUser?.role === 'admin' && (
                            <button
                                onClick={() => navigate(`/admin/users/edit/${id}`)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Editar
                            </button>
                        )}
                    </div>
                </div>

                {/* Card principal con información */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
                    {/* Header del card con avatar */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
                        <div className="flex items-center gap-6">
                            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                                <UserIcon className="w-16 h-16" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{user?.username}</h2>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getRoleColor(user?.role)}`}>
                                    {getRoleIcon(user?.role)}
                                    <span className="font-semibold">{getRoleName(user?.role)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información detallada */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ID */}
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <UserIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase">ID de Usuario</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-800 ml-11">#{user?.id}</p>
                            </div>

                            {/* Email */}
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <Mail className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Correo Electrónico</h3>
                                </div>
                                <p className="text-lg font-medium text-gray-800 ml-11 break-all">{user?.email}</p>
                            </div>

                            {/* Rol detallado */}
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${user?.role === 'admin' ? 'bg-red-100' :
                                            user?.role === 'teacher' ? 'bg-blue-100' :
                                                'bg-green-100'
                                        }`}>
                                        {getRoleIcon(user?.role)}
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Rol en el Sistema</h3>
                                </div>
                                <p className="text-lg font-medium text-gray-800 ml-11">{getRoleName(user?.role)}</p>
                                <p className="text-sm text-gray-500 ml-11 mt-1">
                                    {user?.role === 'admin' && 'Acceso completo al sistema'}
                                    {user?.role === 'teacher' && 'Puede crear y gestionar encuestas de profesores'}
                                    {user?.role === 'student' && 'Puede completar encuestas de estudiantes'}
                                </p>
                            </div>

                            {/* Fecha de registro */}
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Fecha de Registro</h3>
                                </div>
                                <p className="text-lg font-medium text-gray-800 ml-11">
                                    {new Date(user?.created_at).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className="text-sm text-gray-500 ml-11 mt-1">
                                    {new Date(user?.created_at).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Información Adicional
                            </h3>
                            <div className="space-y-2 text-sm text-blue-800">
                                <p>• Este usuario se registró hace{' '}
                                    {Math.floor((new Date() - new Date(user?.created_at)) / (1000 * 60 * 60 * 24))} días
                                </p>
                                <p>• El nombre de usuario no puede ser modificado</p>
                                <p>• Solo los administradores pueden cambiar el rol de un usuario</p>
                            </div>
                        </div>

                        {/* Acciones adicionales */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Volver al Listado
                            </button>
                            {currentUser?.role === 'admin' && (
                                <button
                                    onClick={() => navigate(`/admin/users/edit/${id}`)}
                                    className="flex-1 px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-5 h-5" />
                                    Editar Usuario
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card de estadísticas (opcional) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Estado</p>
                                <p className="text-2xl font-bold text-green-600">Activo</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <UserCheck className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Encuestas</p>
                                <p className="text-2xl font-bold text-blue-600">0</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Último acceso</p>
                                <p className="text-lg font-bold text-purple-600">Hoy</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}