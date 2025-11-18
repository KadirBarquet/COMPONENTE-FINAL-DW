import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    GraduationCap,
    Users,
    BarChart3,
    MessageSquare,
    Sparkles,
    ArrowRight,
    CheckCircle,
    TrendingUp
} from 'lucide-react';
import authService from '../../services/authService';

export default function Home() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();

    // Características del sistema
    const features = [
        {
            icon: <FileText className="w-8 h-8" />,
            title: 'Encuestas Estructuradas',
            description: 'Recopila datos sobre el uso de chatbots de IA en educación de ingeniería de software',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: <MessageSquare className="w-8 h-8" />,
            title: 'Feedback Detallado',
            description: 'Obtén retroalimentación de estudiantes y profesores sobre herramientas de IA',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: 'Análisis Estadístico',
            description: 'Visualiza tendencias y patrones en el uso de chatbots educativos',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: 'Gestión de Usuarios',
            description: 'Administra estudiantes, profesores y permisos del sistema',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    // Beneficios del sistema
    const benefits = [
        'Identifica patrones de uso de chatbots en educación',
        'Mejora la experiencia de aprendizaje con IA',
        'Recopila datos para investigación académica',
        'Optimiza estrategias pedagógicas',
        'Facilita la toma de decisiones basada en datos'
    ];

    // Estadísticas del sistema
    const stats = [
        { label: 'Encuestas Completadas', value: '150+', icon: <FileText className="w-6 h-6" /> },
        { label: 'Usuarios Activos', value: '75+', icon: <Users className="w-6 h-6" /> },
        { label: 'Instituciones', value: '5+', icon: <GraduationCap className="w-6 h-6" /> },
        { label: 'Países', value: '3+', icon: <TrendingUp className="w-6 h-6" /> }
    ];

    const handleGetStarted = () => {
        if (isAuthenticated) {
            // Redirigir según el rol
            if (currentUser?.role === 'admin') {
                navigate('/admin/users');
            } else if (currentUser?.role === 'teacher') {
                navigate('/teacher/surveys');
            } else {
                navigate('/student/surveys');
            }
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Sistema de Encuestas sobre Chatbots en Educación
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Explora el Futuro de la
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {' '}Educación con IA
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Plataforma integral para recopilar y analizar datos sobre el uso de chatbots 
                        de inteligencia artificial en la enseñanza de ingeniería de software
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={handleGetStarted}
                            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-xl"
                        >
                            {isAuthenticated ? 'Ir al Dashboard' : 'Comenzar Ahora'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        {!isAuthenticated && (
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all border-2 border-gray-200 shadow-lg"
                            >
                                Iniciar Sesión
                            </button>
                        )}
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-slide-up">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Características Principales
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Herramientas completas para la investigación y análisis del uso de chatbots en educación
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-2 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-4`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                ¿Por qué usar nuestro sistema?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Basado en investigación académica sobre el impacto de chatbots de IA 
                                en la educación de ingeniería de software.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-start gap-3 animate-fade-in"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="bg-green-100 p-1 rounded-full flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <p className="text-gray-700">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                                <div className="mb-6">
                                    <MessageSquare className="w-16 h-16 mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">
                                        Investigación Académica
                                    </h3>
                                    <p className="text-blue-100">
                                        Sistema desarrollado con base en estudios científicos sobre 
                                        el uso de ChatGPT, Gemini, Bing y otros chatbots en educación.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 rounded-lg p-4">
                                        <p className="text-3xl font-bold">56.9%</p>
                                        <p className="text-sm text-blue-100">Estudiantes usan chatbots</p>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-4">
                                        <p className="text-3xl font-bold">4.2/5</p>
                                        <p className="text-sm text-blue-100">Calificación promedio</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white shadow-2xl">
                    <h2 className="text-4xl font-bold mb-4">
                        ¿Listo para comenzar?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                        Únete a la investigación sobre el futuro de la educación con inteligencia artificial
                    </p>
                    <button
                        onClick={handleGetStarted}
                        className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-xl"
                    >
                        {isAuthenticated ? 'Ir al Dashboard' : 'Registrarse Gratis'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}