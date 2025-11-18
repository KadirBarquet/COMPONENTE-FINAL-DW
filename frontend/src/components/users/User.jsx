import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User as UserIcon,
    Edit2,
    Trash2,
    Plus,
    Search,
    Shield,
    UserCheck,
    GraduationCap,
    Loader,
    Eye,
    AlertCircle,
    X
} from 'lucide-react';
import userService from '../../services/userService';
import authService from '../../services/authService';

export default function User() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);

    // Modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Cargar usuarios al montar
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAll();
            setUsers(response.users || []);
        } catch (error) {
            showNotification(error.message || 'Error al cargar usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar usuarios
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Mostrar notificación
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Abrir modal de eliminación
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    // Cerrar modal de eliminación
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    // Confirmar eliminación
    const handleDelete = async () => {
        if (!userToDelete) return;

        setDeleting(true);
        try {
            await userService.delete(userToDelete.id);
            showNotification('Usuario eliminado exitosamente', 'success');
            await loadUsers();
            closeDeleteModal();
        } catch (error) {
            showNotification(error.message || 'Error al eliminar usuario', 'error');
        } finally {
            setDeleting(false);
        }
    };

    // Obtener icono según rol
    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield className="w-4 h-4" />;
            case 'teacher': return <GraduationCap className="w-4 h-4" />;
            default: return <UserCheck className="w-4 h-4" />;
        }
    };

    // Obtener color según rol
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'teacher': return 'bg-blue-100 text-blue-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    // Obtener nombre de rol en español
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
                    <p className="text-gray-600">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-3 rounded-lg">
                                <UserIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
                                <p className="text-gray-600">Administra los usuarios del sistema</p>
                            </div>
                        </div>
                        {currentUser?.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin/users/new')}
                                className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                <Plus className="w-5 h-5" />
                                Nuevo Usuario
                            </button>
                        )}
                    </div>
                </div>

                {/* Notificación */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-lg shadow-lg animate-slide-up flex items-center gap-3 ${notification.type === 'success'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}>
                        <AlertCircle className="w-5 h-5" />
                        {notification.message}
                    </div>
                )}

                {/* Búsqueda y Estadísticas */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                    {/* Búsqueda */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o rol..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Usuarios</p>
                                    <p className="text-3xl font-bold">{users.length}</p>
                                </div>
                                <UserIcon className="w-12 h-12 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Administradores</p>
                                    <p className="text-3xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                                </div>
                                <Shield className="w-12 h-12 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Profesores</p>
                                    <p className="text-3xl font-bold">{users.filter(u => u.role === 'teacher').length}</p>
                                </div>
                                <GraduationCap className="w-12 h-12 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Estudiantes</p>
                                    <p className="text-3xl font-bold">{users.filter(u => u.role === 'student').length}</p>
                                </div>
                                <UserCheck className="w-12 h-12 opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Usuario</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rol</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha de Registro</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 p-2 rounded-full">
                                                    <UserIcon className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="font-medium text-gray-900">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                {getRoleName(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(user.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                {currentUser?.role === 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(user)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                            disabled={user.id === currentUser.id}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
                            <p className="text-gray-400 text-sm">Intenta con otros términos de búsqueda</p>
                        </div>
                    )}
                </div>

                {/* Modal de confirmación de eliminación */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-slide-up">
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                                    ¿Eliminar Usuario?
                                </h3>
                                <p className="text-center text-gray-600 mb-6">
                                    ¿Estás seguro de que deseas eliminar al usuario{' '}
                                    <span className="font-semibold">{userToDelete?.username}</span>?
                                    Esta acción no se puede deshacer.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={closeDeleteModal}
                                        disabled={deleting}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {deleting ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Eliminando...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                Eliminar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}