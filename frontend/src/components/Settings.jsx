import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Moon,
    Sun,
    Mail,
    Lock,
    Eye,
    Database,
    Trash2,
    Download,
    AlertCircle,
    CheckCircle,
    Loader,
    Save,
    RefreshCw
} from 'lucide-react';
import authService from '../services/authService';

export default function Settings() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeTab, setActiveTab] = useState('general');

    // Estados de configuración
    const [settings, setSettings] = useState({
        // General
        language: 'es',
        timezone: 'America/Guayaquil',
        dateFormat: 'DD/MM/YYYY',
        
        // Notificaciones
        emailNotifications: true,
        surveyReminders: true,
        systemUpdates: false,
        weeklyReports: false,
        
        // Apariencia
        theme: 'light',
        compactMode: false,
        fontSize: 'medium',
        
        // Privacidad
        profileVisibility: 'private',
        showEmail: false,
        allowAnalytics: true
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = () => {
        // Cargar configuraciones desde localStorage
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    };

    const saveSettings = () => {
        setLoading(true);
        try {
            localStorage.setItem('userSettings', JSON.stringify(settings));
            showNotification('Configuración guardada exitosamente', 'success');
        } catch (error) {
            showNotification('Error al guardar configuración', 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetSettings = () => {
        const defaultSettings = {
            language: 'es',
            timezone: 'America/Guayaquil',
            dateFormat: 'DD/MM/YYYY',
            emailNotifications: true,
            surveyReminders: true,
            systemUpdates: false,
            weeklyReports: false,
            theme: 'light',
            compactMode: false,
            fontSize: 'medium',
            profileVisibility: 'private',
            showEmail: false,
            allowAnalytics: true
        };
        setSettings(defaultSettings);
        localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
        showNotification('Configuración restaurada a valores predeterminados', 'success');
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const exportData = () => {
        const userData = {
            user: currentUser,
            settings: settings,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chatbots-survey-data-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        showNotification('Datos exportados exitosamente', 'success');
    };

    const handleDeleteAccount = () => {
        if (deleteConfirmation === currentUser.username) {
            // Aquí deberías llamar a un endpoint para eliminar la cuenta
            authService.logout();
            navigate('/login');
            showNotification('Cuenta eliminada exitosamente', 'success');
        } else {
            showNotification('El nombre de usuario no coincide', 'error');
        }
    };

    const tabs = [
        { id: 'general', name: 'General', icon: SettingsIcon },
        { id: 'notifications', name: 'Notificaciones', icon: Bell },
        { id: 'appearance', name: 'Apariencia', icon: Palette },
        { id: 'privacy', name: 'Privacidad', icon: Shield },
        { id: 'data', name: 'Datos', icon: Database }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-3 rounded-lg">
                            <SettingsIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
                            <p className="text-gray-600">Personaliza tu experiencia en la plataforma</p>
                        </div>
                    </div>
                </div>

                {/* Notificación */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-lg shadow-lg animate-slide-up flex items-center gap-3 ${
                        notification.type === 'success' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                    }`}>
                        {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {notification.message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Tabs laterales */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-4 animate-fade-in">
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-md p-8 animate-fade-in">
                            {/* General */}
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <SettingsIcon className="w-6 h-6 text-blue-600" />
                                            Configuración General
                                        </h2>
                                        <p className="text-gray-600 mb-6">Ajusta las preferencias básicas de tu cuenta</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Globe className="inline w-4 h-4 mr-2" />
                                            Idioma
                                        </label>
                                        <select
                                            value={settings.language}
                                            onChange={(e) => handleSettingChange('language', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="es">Español</option>
                                            <option value="en">English</option>
                                            <option value="pt">Português</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Zona Horaria
                                        </label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => handleSettingChange('timezone', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="America/Guayaquil">Ecuador (GMT-5)</option>
                                            <option value="America/Mexico_City">México (GMT-6)</option>
                                            <option value="America/Lima">Perú (GMT-5)</option>
                                            <option value="America/Bogota">Colombia (GMT-5)</option>
                                            <option value="Europe/Madrid">España (GMT+1)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Formato de Fecha
                                        </label>
                                        <select
                                            value={settings.dateFormat}
                                            onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Notificaciones */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Bell className="w-6 h-6 text-blue-600" />
                                            Preferencias de Notificaciones
                                        </h2>
                                        <p className="text-gray-600 mb-6">Controla cómo y cuándo recibes notificaciones</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-gray-800">Notificaciones por Email</p>
                                                    <p className="text-sm text-gray-600">Recibe actualizaciones importantes por correo</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.emailNotifications}
                                                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-gray-800">Recordatorios de Encuestas</p>
                                                    <p className="text-sm text-gray-600">Te recordaremos completar encuestas pendientes</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.surveyReminders}
                                                    onChange={(e) => handleSettingChange('surveyReminders', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-gray-800">Actualizaciones del Sistema</p>
                                                    <p className="text-sm text-gray-600">Nuevas funciones y mejoras de la plataforma</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.systemUpdates}
                                                    onChange={(e) => handleSettingChange('systemUpdates', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-gray-800">Reportes Semanales</p>
                                                    <p className="text-sm text-gray-600">Resumen semanal de tu actividad</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.weeklyReports}
                                                    onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Apariencia */}
                            {activeTab === 'appearance' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Palette className="w-6 h-6 text-blue-600" />
                                            Apariencia
                                        </h2>
                                        <p className="text-gray-600 mb-6">Personaliza el aspecto de la interfaz</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Tema
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <button
                                                onClick={() => handleSettingChange('theme', 'light')}
                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                    settings.theme === 'light'
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                                                <p className="text-sm font-medium text-center">Claro</p>
                                            </button>
                                            <button
                                                onClick={() => handleSettingChange('theme', 'dark')}
                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                    settings.theme === 'dark'
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                                                <p className="text-sm font-medium text-center">Oscuro</p>
                                            </button>
                                            <button
                                                onClick={() => handleSettingChange('theme', 'auto')}
                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                    settings.theme === 'auto'
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                <SettingsIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                                                <p className="text-sm font-medium text-center">Auto</p>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tamaño de Fuente
                                        </label>
                                        <select
                                            value={settings.fontSize}
                                            onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="small">Pequeña</option>
                                            <option value="medium">Media</option>
                                            <option value="large">Grande</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div>
                                            <p className="font-medium text-gray-800">Modo Compacto</p>
                                            <p className="text-sm text-gray-600">Reduce el espaciado en la interfaz</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.compactMode}
                                                onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Privacidad */}
                            {activeTab === 'privacy' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Shield className="w-6 h-6 text-blue-600" />
                                            Privacidad y Seguridad
                                        </h2>
                                        <p className="text-gray-600 mb-6">Controla quién puede ver tu información</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Visibilidad del Perfil
                                        </label>
                                        <select
                                            value={settings.profileVisibility}
                                            onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="public">Público</option>
                                            <option value="private">Privado</option>
                                            <option value="contacts">Solo contactos</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <Eye className="w-5 h-5 text-gray-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-gray-800">Mostrar Email</p>
                                                    <p className="text-sm text-gray-600">Tu email será visible en tu perfil público</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.showEmail}
                                                    onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <Database className="w-5 h-5 text-gray-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-gray-800">Permitir Analíticas</p>
                                                    <p className="text-sm text-gray-600">Ayúdanos a mejorar la plataforma</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.allowAnalytics}
                                                    onChange={(e) => handleSettingChange('allowAnalytics', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-yellow-800">Seguridad de la Cuenta</p>
                                                <p className="text-sm text-yellow-700 mt-1">
                                                    Se recomienda cambiar tu contraseña cada 3 meses para mayor seguridad
                                                </p>
                                                <button
                                                    onClick={() => navigate('/profile')}
                                                    className="mt-3 text-sm text-yellow-800 font-medium hover:underline"
                                                >
                                                    Cambiar contraseña →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Datos */}
                            {activeTab === 'data' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Database className="w-6 h-6 text-blue-600" />
                                            Gestión de Datos
                                        </h2>
                                        <p className="text-gray-600 mb-6">Administra tu información y privacidad</p>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            onClick={exportData}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Download className="w-5 h-5 text-blue-600" />
                                                <div className="text-left">
                                                    <p className="font-medium text-gray-800">Exportar Datos</p>
                                                    <p className="text-sm text-gray-600">Descarga una copia de tu información</p>
                                                </div>
                                            </div>
                                            <Download className="w-5 h-5 text-gray-400" />
                                        </button>

                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Trash2 className="w-5 h-5 text-red-600" />
                                                <div className="text-left">
                                                    <p className="font-medium text-red-800">Eliminar Cuenta</p>
                                                    <p className="text-sm text-red-600">Esta acción no se puede deshacer</p>
                                                </div>
                                            </div>
                                            <AlertCircle className="w-5 h-5 text-red-400" />
                                        </button>
                                    </div>

                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-blue-800">Información sobre tus datos</p>
                                                <p className="text-sm text-blue-700 mt-1">
                                                    Tus datos se almacenan de forma segura y solo se utilizan para mejorar tu experiencia en la plataforma.
                                                    Nunca compartimos tu información con terceros sin tu consentimiento.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Botones de acción */}
                            {activeTab !== 'data' && (
                                <div className="flex gap-4 pt-6 border-t mt-8">
                                    <button
                                        onClick={resetSettings}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        Restaurar Valores Predeterminados
                                    </button>
                                    <button
                                        onClick={saveSettings}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loading ? (
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
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal de eliminación de cuenta */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-scale-in">
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                                    ¿Eliminar tu cuenta?
                                </h3>
                                <p className="text-center text-gray-600 mb-6">
                                    Esta acción es permanente y no se puede deshacer. Todos tus datos serán eliminados.
                                </p>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Para confirmar, escribe tu nombre de usuario: <span className="font-bold">{currentUser?.username}</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        placeholder="Escribe tu nombre de usuario"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setDeleteConfirmation('');
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={deleteConfirmation !== currentUser?.username}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar Cuenta
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