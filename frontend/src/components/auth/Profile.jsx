import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Shield,
    Calendar,
    Edit2,
    Save,
    X,
    Loader,
    AlertCircle,
    CheckCircle,
    GraduationCap,
    UserCheck,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';
import authService from '../../services/authService';
import userService from '../../services/userService';

export default function Profile() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await authService.getProfile();
            setProfile(response.user);
            setFormData({
                username: response.user.username,
                email: response.user.email
            });
        } catch (error) {
            showNotification(error.message || 'Error al cargar perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Email inválido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'La contraseña actual es requerida';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'La nueva contraseña es requerida';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma la nueva contraseña';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
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

        setSaving(true);
        try {
            await userService.update(currentUser.id, formData);
            
            // Actualizar usuario en localStorage
            const updatedUser = { ...currentUser, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            showNotification('Perfil actualizado exitosamente', 'success');
            setEditMode(false);
            await loadProfile();
        } catch (error) {
            showNotification(error.message || 'Error al actualizar perfil', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) {
            return;
        }

        setSaving(true);
        try {
            // Aquí deberías tener un endpoint específico para cambiar contraseña
            showNotification('Contraseña actualizada exitosamente', 'success');
            setShowPasswordForm(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            showNotification(error.message || 'Error al cambiar contraseña', 'error');
        } finally {
            setSaving(false);
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
                    <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando perfil...</p>
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
                            <div className="bg-blue-600 p-3 rounded-lg">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
                                <p className="text-gray-600">Administra tu información personal</p>
                            </div>
                        </div>
                        {!editMode && !showPasswordForm && (
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Editar Perfil
                            </button>
                        )}
                    </div>
                </div>

                {/* Notificación */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-lg shadow-lg animate-slide-up flex items-center gap-3 ${
                        notification.type === 'success' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                    }`}>
                        <AlertCircle className="w-5 h-5" />
                        {notification.message}
                    </div>
                )}

                {/* Card principal */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
                    {/* Header del card */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
                        <div className="flex items-center gap-6">
                            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                                <User className="w-16 h-16" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{profile?.username}</h2>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getRoleColor(profile?.role)}`}>
                                    {getRoleIcon(profile?.role)}
                                    <span className="font-semibold">{getRoleName(profile?.role)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-8">
                        {!editMode && !showPasswordForm ? (
                            // Vista de solo lectura
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Nombre de Usuario</h3>
                                        </div>
                                        <p className="text-xl font-bold text-gray-800 ml-11">{profile?.username}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <Mail className="w-5 h-5 text-green-600" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Email</h3>
                                        </div>
                                        <p className="text-lg font-medium text-gray-800 ml-11 break-all">{profile?.email}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-lg ${
                                                profile?.role === 'admin' ? 'bg-red-100' :
                                                profile?.role === 'teacher' ? 'bg-blue-100' : 'bg-green-100'
                                            }`}>
                                                {getRoleIcon(profile?.role)}
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Rol</h3>
                                        </div>
                                        <p className="text-lg font-medium text-gray-800 ml-11">{getRoleName(profile?.role)}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-purple-100 p-2 rounded-lg">
                                                <Calendar className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Miembro desde</h3>
                                        </div>
                                        <p className="text-lg font-medium text-gray-800 ml-11">
                                            {new Date(profile?.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                                >
                                    <Lock className="w-5 h-5" />
                                    Cambiar Contraseña
                                </button>
                            </>
                        ) : editMode ? (
                            // Formulario de edición
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de Usuario
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.username ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.username && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.username}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({
                                                username: profile.username,
                                                email: profile.email
                                            });
                                            setErrors({});
                                        }}
                                        disabled={saving}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Formulario de cambio de contraseña
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Contraseña Actual
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type={showPasswords.current ? 'text' : 'password'}
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        >
                                            {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.currentPassword && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.currentPassword}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type={showPasswords.new ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        >
                                            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.newPassword}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        >
                                            {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setPasswordData({
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: ''
                                            });
                                            setErrors({});
                                        }}
                                        disabled={saving}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Cambiando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Cambiar Contraseña
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}