import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FileText,
    ArrowLeft,
    Edit2,
    Loader,
    AlertCircle,
    User,
    Calendar,
    CheckCircle,
    XCircle,
    Star,
    MessageSquare,
    TrendingUp,
    Target
} from 'lucide-react';
import studentSurveyService from '../../../services/studentSurveyService';
import authService from '../../../services/authService';

export default function StudentSurveyDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const currentUser = authService.getCurrentUser();

    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSurveyData();
    }, [id]);

    const loadSurveyData = async () => {
        try {
            setLoading(true);
            const response = await studentSurveyService.getById(id);
            setSurvey(response.survey);
        } catch (err) {
            setError(err.message || 'Error al cargar la encuesta');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-5 h-5 ${i < rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando encuesta...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/student/surveys')}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/student/surveys')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div className="bg-green-600 p-3 rounded-lg">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Detalle de Encuesta</h1>
                                <p className="text-gray-600">Encuesta de estudiante #{survey?.id}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/student/surveys/edit/${id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Editar
                        </button>
                    </div>
                </div>

                {/* Card principal */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
                    {/* Header del card */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                                    <User className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{survey?.username || 'Usuario'}</h2>
                                    <p className="text-green-100">{survey?.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-green-100 mb-1">Fecha de creación</p>
                                <p className="text-lg font-semibold">
                                    {new Date(survey?.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-8">
                        {/* Uso General */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                Uso General
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                        ¿Usa Chatbots?
                                    </p>
                                    {survey?.has_used_chatbot ? (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                            <span className="text-xl font-bold text-green-600">Sí</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <XCircle className="w-6 h-6 text-red-600" />
                                            <span className="text-xl font-bold text-red-600">No</span>
                                        </div>
                                    )}
                                </div>

                                {survey?.has_used_chatbot && (
                                    <>
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                                Frecuencia de Uso
                                            </p>
                                            <p className="text-xl font-bold text-gray-800">
                                                {survey?.usage_frequency}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {survey?.has_used_chatbot && survey?.chatbots_used && (
                                <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
                                    <p className="text-sm font-semibold text-blue-900 uppercase mb-3">
                                        Chatbots Utilizados
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {survey.chatbots_used.map((chatbot, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                            >
                                                {chatbot}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Utilidad y Experiencia */}
                        {survey?.has_used_chatbot && (
                            <>
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Star className="w-6 h-6 text-yellow-500" />
                                        Utilidad y Experiencia
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <p className="text-sm font-semibold text-gray-500 uppercase mb-3">
                                                Utilidad (1-5)
                                            </p>
                                            {renderStars(survey?.usefulness_rating)}
                                            <p className="text-2xl font-bold text-gray-800 mt-2">
                                                {survey?.usefulness_rating}/5
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <p className="text-sm font-semibold text-gray-500 uppercase mb-3">
                                                Experiencia (1-5)
                                            </p>
                                            {renderStars(survey?.overall_experience)}
                                            <p className="text-2xl font-bold text-gray-800 mt-2">
                                                {survey?.overall_experience}/5
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                                Chatbot Preferido
                                            </p>
                                            <p className="text-xl font-bold text-gray-800">
                                                {survey?.preferred_chatbot || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tareas */}
                                {survey?.tasks_used_for && survey.tasks_used_for.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Target className="w-6 h-6 text-purple-600" />
                                            Tareas Realizadas
                                        </h3>
                                        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                                            <ul className="space-y-2">
                                                {survey.tasks_used_for.map((task, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-800">{task}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Comparación y Uso Futuro */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                                        Evaluación y Planes Futuros
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                                Efectividad vs Otros Recursos
                                            </p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {survey?.effectiveness_comparison}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                                ¿Continuará Usando?
                                            </p>
                                            {survey?.will_continue_using ? (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                    <span className="text-xl font-bold text-green-600">Sí</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="w-6 h-6 text-red-600" />
                                                    <span className="text-xl font-bold text-red-600">No</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                                ¿Recomendaría?
                                            </p>
                                            {survey?.would_recommend ? (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                    <span className="text-xl font-bold text-green-600">Sí</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="w-6 h-6 text-red-600" />
                                                    <span className="text-xl font-bold text-red-600">No</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Comentarios adicionales */}
                        {survey?.additional_comments && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-6 h-6 text-gray-600" />
                                    Comentarios Adicionales
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {survey.additional_comments}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                onClick={() => navigate('/student/surveys')}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Volver al Listado
                            </button>
                            <button
                                onClick={() => navigate(`/student/surveys/edit/${id}`)}
                                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                <Edit2 className="w-5 h-5" />
                                Editar Encuesta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}