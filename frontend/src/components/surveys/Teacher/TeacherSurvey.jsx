import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    Edit2,
    Trash2,
    Plus,
    Search,
    Eye,
    Loader,
    AlertCircle,
    TrendingUp,
    Users,
    CheckCircle,
    XCircle,
    BookOpen
} from 'lucide-react';
import teacherSurveyService from '../../../services/teacherSurveyService';
import authService from '../../../services/authService';

export default function TeacherSurvey() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';
    const isTeacher = currentUser?.role === 'teacher' || isAdmin;

    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);
    const [statistics, setStatistics] = useState(null);

    // Modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [surveyToDelete, setSurveyToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Cargar encuestas
            if (isAdmin) {
                const response = await teacherSurveyService.getAll();
                setSurveys(response.surveys || []);
            } else {
                const response = await teacherSurveyService.getMysurveys();
                setSurveys(response.surveys || []);
            }

            // Cargar estadísticas
            const statsResponse = await teacherSurveyService.getStatistics();
            setStatistics(statsResponse.statistics);
        } catch (error) {
            showNotification(error.message || 'Error al cargar encuestas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredSurveys = surveys.filter(survey =>
        survey.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.institution_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const openDeleteModal = (survey) => {
        setSurveyToDelete(survey);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSurveyToDelete(null);
    };

    const handleDelete = async () => {
        if (!surveyToDelete) return;

        setDeleting(true);
        try {
            await teacherSurveyService.delete(surveyToDelete.id);
            showNotification('Encuesta eliminada exitosamente', 'success');
            await loadData();
            closeDeleteModal();
        } catch (error) {
            showNotification(error.message || 'Error al eliminar encuesta', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const getLikelihoodColor = (likelihood) => {
        switch (likelihood) {
            case 'Muy probable': return 'bg-blue-100 text-blue-800';
            case 'Probable': return 'bg-yellow-100 text-yellow-800';
            case 'Imposible': return 'bg-red-100 text-red-800';
            case 'Muy improbable': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando encuestas...</p>
                </div>
            </div>
        );
    }

    if (!isTeacher) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h2>
                    <p className="text-gray-600 mb-6">Solo los profesores pueden acceder a esta sección</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 p-3 rounded-lg">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Encuestas de Profesores</h1>
                                <p className="text-gray-600">
                                    {isAdmin ? 'Gestiona todas las encuestas' : 'Gestiona tus encuestas'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/teacher/surveys/new')}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Nueva Encuesta
                        </button>
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

                {/* Estadísticas */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Encuestas</p>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {statistics.total_surveys || 0}
                                    </p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <BookOpen className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Usan Chatbots</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {statistics.teachers_using_chatbots || 0}
                                    </p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Muy Probable Continuar</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {statistics.very_likely_continue || 0}
                                    </p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <TrendingUp className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Probable Continuar</p>
                                    <p className="text-3xl font-bold text-indigo-600">
                                        {statistics.likely_continue || 0}
                                    </p>
                                </div>
                                <div className="bg-indigo-100 p-3 rounded-full">
                                    <Users className="w-8 h-8 text-indigo-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Búsqueda */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por usuario, email, país o institución..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Tabla de encuestas */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Usuario</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Usa Chatbot</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">País</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Institución</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Probabilidad Uso Futuro</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSurveys.map((survey) => (
                                    <tr key={survey.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-indigo-100 p-2 rounded-full">
                                                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{survey.username || 'Usuario'}</p>
                                                    <p className="text-sm text-gray-500">{survey.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {survey.has_used_chatbot ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Sí
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                                    <XCircle className="w-4 h-4" />
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900">{survey.country || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700 text-sm">{survey.institution_type || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLikelihoodColor(survey.likelihood_future_use)}`}>
                                                {survey.likelihood_future_use || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {new Date(survey.created_at).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/teacher/surveys/${survey.id}`)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/teacher/surveys/edit/${survey.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(survey)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredSurveys.length === 0 && (
                        <div className="text-center py-12">
                            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No se encontraron encuestas</p>
                            <p className="text-gray-400 text-sm mb-4">Crea tu primera encuesta para comenzar</p>
                            <button
                                onClick={() => navigate('/teacher/surveys/new')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Nueva Encuesta
                            </button>
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
                                    ¿Eliminar Encuesta?
                                </h3>
                                <p className="text-center text-gray-600 mb-6">
                                    ¿Estás seguro de que deseas eliminar esta encuesta?
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