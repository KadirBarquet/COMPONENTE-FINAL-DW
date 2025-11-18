import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    GraduationCap,
    ArrowLeft,
    Edit2,
    Loader,
    AlertCircle,
    User,
    Calendar,
    CheckCircle,
    XCircle,
    MessageSquare,
    TrendingUp,
    Target,
    Globe,
    Building2,
    Award
} from 'lucide-react';
import teacherSurveyService from '../../../services/teacherSurveyService';
import authService from '../../../services/authService';

export default function TeacherSurveyDetail() {
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
            const response = await teacherSurveyService.getById(id);
            setSurvey(response.survey);
        } catch (err) {
            setError(err.message || 'Error al cargar la encuesta');
        } finally {
            setLoading(false);
        }
    };

    const getLikelihoodColor = (likelihood) => {
        switch (likelihood) {
            case 'Very likely': return 'bg-green-100 text-green-800 border-green-200';
            case 'Likely': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Unlikely': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Very unlikely': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando encuesta...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/teacher/surveys')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/teacher/surveys')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div className="bg-indigo-600 p-3 rounded-lg">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Detalle de Encuesta</h1>
                                <p className="text-gray-600">Encuesta de profesor #{survey?.id}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/teacher/surveys/edit/${id}`)}
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
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                                    <User className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{survey?.username || 'Usuario'}</h2>
                                    <p className="text-indigo-100">{survey?.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-indigo-100 mb-1">Fecha de creación</p>
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
                        {/* Información Demográfica */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-indigo-600" />
                                Información Demográfica
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                        Edad
                                    </p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {survey?.age_range}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="w-4 h-4 text-gray-500" />
                                        <p className="text-sm font-semibold text-gray-500 uppercase">
                                            País
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">
                                        {survey?.country}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                        Tipo de Institución
                                    </p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {survey?.institution_type}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award className="w-4 h-4 text-gray-500" />
                                        <p className="text-sm font-semibold text-gray-500 uppercase">
                                            Experiencia
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">
                                        {survey?.years_experience}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Uso General */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-indigo-600" />
                                Experiencia con Chatbots
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                        ¿Ha Usado Chatbots?
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

                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                        Probabilidad de Uso Futuro
                                    </p>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold border ${getLikelihoodColor(survey?.likelihood_future_use)}`}>
                                        {survey?.likelihood_future_use}
                                    </span>
                                </div>
                            </div>

                            {/* Chatbots utilizados */}
                            {survey?.has_used_chatbot && survey?.chatbots_used && survey.chatbots_used.length > 0 && (
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

                            {/* Cursos donde se usó */}
                            {survey?.has_used_chatbot && survey?.courses_used && survey.courses_used.length > 0 && (
                                <div className="mt-6 bg-purple-50 rounded-lg p-6 border border-purple-200">
                                    <p className="text-sm font-semibold text-purple-900 uppercase mb-3">
                                        Cursos/Etapas donde se Usó
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {survey.courses_used.map((course, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-800">{course}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Propósitos y Resultados */}
                        {survey?.has_used_chatbot && (
                            <>
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Target className="w-6 h-6 text-green-600" />
                                        Propósitos y Resultados
                                    </h3>

                                    {/* Propósitos */}
                                    {survey?.purposes && survey.purposes.length > 0 && (
                                        <div className="mb-6 bg-green-50 rounded-lg p-6 border border-green-200">
                                            <p className="text-sm font-semibold text-green-900 uppercase mb-3">
                                                Propósitos de Uso
                                            </p>
                                            <ul className="space-y-2">
                                                {survey.purposes.map((purpose, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-800">{purpose}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Resultados */}
                                    {survey?.outcomes && survey.outcomes.length > 0 && (
                                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                                            <p className="text-sm font-semibold text-blue-900 uppercase mb-3">
                                                Resultados Obtenidos
                                            </p>
                                            <ul className="space-y-2">
                                                {survey.outcomes.map((outcome, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-800">{outcome}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Desafíos */}
                                {survey?.challenges && survey.challenges.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                                            Desafíos Encontrados
                                        </h3>
                                        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                                            <ul className="space-y-2">
                                                {survey.challenges.map((challenge, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-800">{challenge}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Ventajas y Preocupaciones */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-indigo-600" />
                                Ventajas y Preocupaciones
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Ventajas */}
                                {survey?.advantages && survey.advantages.length > 0 && (
                                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                                        <p className="text-sm font-semibold text-green-900 uppercase mb-3">
                                            Ventajas Principales
                                        </p>
                                        <ul className="space-y-2">
                                            {survey.advantages.map((advantage, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-800">{advantage}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Preocupaciones */}
                                {survey?.concerns && survey.concerns.length > 0 && (
                                    <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                                        <p className="text-sm font-semibold text-orange-900 uppercase mb-3">
                                            Preocupaciones
                                        </p>
                                        <ul className="space-y-2">
                                            {survey.concerns.map((concern, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-800">{concern}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recursos Necesarios */}
                        {survey?.resources_needed && survey.resources_needed.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-purple-600" />
                                    Recursos Necesarios
                                </h3>
                                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {survey.resources_needed.map((resource, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-800">{resource}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comentarios adicionales */}
                        {survey?.additional_comments && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-6 h-6 text-gray-600" />
                                    Comentarios y Recomendaciones
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
                                onClick={() => navigate('/teacher/surveys')}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Volver al Listado
                            </button>
                            <button
                                onClick={() => navigate(`/teacher/surveys/edit/${id}`)}
                                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
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