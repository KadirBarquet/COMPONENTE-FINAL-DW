import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    User as UserIcon,
    Mail,
    Lock,
    Save,
    X,
    AlertCircle,
    Loader,
    ArrowLeft
} from 'lucide-react';
import userService from '../../services/userService';

export default function UserForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [notification, setNotification] = useState(null);

    // Cargar datos del usuario si es modo edición
    useEffect(() => {
        if (isEditMode) {
            loadUserData();
        }
    }, [id]);

    const loadUserData = async () => {
        try {
            setLoadingData(true);
            const response = await userService.getById(id);
            setFormData({
                username: response.user.username,
                email: response.user.email,
                password: '',
                role: response.user.role
            });
        } catch (error) {
            showNotification(error.message || 'Error al cargar usuario', 'error');
            setTimeout(() => navigate('/admin/users'), 2000);
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Limpiar error del campo
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar username
        if (!formData.username) {
            newErrors.username = 'El nombre de usuario es requerido';
        } else if (formData.username.length < 3) {
            newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        } else if (formData.username.length > 50) {
            newErrors.username = 'El nombre de usuario no puede tener más de 50 caracteres';
        }

        // Validar email
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'El correo electrónico no es válido';
            }
        }

        // Validar password (solo si es modo crear o si se proporciona en modo editar)
        if (!isEditMode) {
            if (!formData.password) {
                newErrors.password = 'La contraseña es requerida';
            } else if (formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (isEditMode) {
                // Actualizar usuario
                const updateData = {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role
                };
                await userService.update(id, updateData);
                showNotification('Usuario actualizado exitosamente', 'success');
            } else {
                // Crear usuario
                await userService.create(formData);
                showNotification('Usuario creado exitosamente', 'success');
            }

            setTimeout(() => navigate('/admin/users'), 1500);
        } catch (error) {
            showNotification(error.message || 'Error al guardar usuario', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando datos del usuario...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-3xl mx-auto">
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
                                <h1 className="text-3xl font-bold text-gray-800">
                                    {isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}
                                </h1>
                                <p className="text-gray-600">
                                    {isEditMode ? 'Actualiza los datos del usuario' : 'Completa el formulario para crear un nuevo usuario'}
                                </p>
                            </div>
                        </div>
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

                {/* Formulario */}
                <div className="bg-white rounded-lg shadow-md p-8 animate-fade-in">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de Usuario <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.username ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="juan_perez"
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="usuario@ejemplo.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña {!isEditMode && <span className="text-red-500">*</span>}
                                {isEditMode && <span className="text-gray-500 text-xs ml-2">(Dejar en blanco para no cambiar)</span>}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.password}
                                </p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">Mínimo 6 caracteres</p>
                        </div>

                        {/* Rol */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                Rol <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                                <option value="student">Estudiante</option>
                                <option value="teacher">Profesor</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <p className="text-gray-500 text-xs mt-1">
                                Selecciona el rol del usuario en el sistema
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users')}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        {isEditMode ? 'Actualizando...' : 'Creando...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        {isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}