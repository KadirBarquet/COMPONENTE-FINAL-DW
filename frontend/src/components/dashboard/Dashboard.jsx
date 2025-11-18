import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Users,
    FileText,
    GraduationCap,
    TrendingUp,
    TrendingDown,
    Activity,
    PieChart,
    Loader,
    AlertCircle,
    CheckCircle,
    XCircle,
    Calendar,
    MessageSquare
} from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import studentSurveyService from '../../services/studentSurveyService';
import teacherSurveyService from '../../services/teacherSurveyService';
import userService from '../../services/userService';
import authService from '../../services/authService';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function Dashboard() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados para las estadísticas
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudentSurveys: 0,
        totalTeacherSurveys: 0,
        avgUsefulness: 0,
        studentsUsingChatbots: 0,
        teachersUsingChatbots: 0
    });

    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Cargar datos en paralelo
            const [
                usersResponse,
                studentStatsResponse,
                teacherStatsResponse,
                studentSurveysResponse,
                teacherSurveysResponse
            ] = await Promise.all([
                isAdmin ? userService.getAll() : Promise.resolve({ users: [] }),
                studentSurveyService.getStatistics(),
                teacherSurveyService.getStatistics(),
                studentSurveyService.getMysurveys(),
                currentUser?.role === 'teacher' || isAdmin 
                    ? teacherSurveyService.getMysurveys() 
                    : Promise.resolve({ surveys: [] })
            ]);

            // Procesar estadísticas
            setStats({
                totalUsers: usersResponse.users?.length || 0,
                totalStudentSurveys: parseInt(studentStatsResponse.statistics?.total_surveys || 0),
                totalTeacherSurveys: parseInt(teacherStatsResponse.statistics?.total_surveys || 0),
                avgUsefulness: parseFloat(studentStatsResponse.statistics?.avg_usefulness || 0).toFixed(1),
                studentsUsingChatbots: parseInt(studentStatsResponse.statistics?.users_with_chatbot || 0),
                teachersUsingChatbots: parseInt(teacherStatsResponse.statistics?.teachers_using_chatbots || 0)
            });

            // Preparar datos para gráficos
            prepareChartData(studentSurveysResponse.surveys || [], teacherSurveysResponse.surveys || []);
        } catch (err) {
            setError(err.message || 'Error al cargar datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    const prepareChartData = (studentSurveys, teacherSurveys) => {
        // Datos para gráfico de uso de chatbots
        const chatbotUsage = {
            students: studentSurveys.filter(s => s.has_used_chatbot).length,
            teachers: teacherSurveys.filter(s => s.has_used_chatbot).length
        };

        // Contar chatbots más usados
        const chatbotCounts = {};
        studentSurveys.forEach(survey => {
            if (survey.chatbots_used) {
                survey.chatbots_used.forEach(chatbot => {
                    chatbotCounts[chatbot] = (chatbotCounts[chatbot] || 0) + 1;
                });
            }
        });

        setChartData({
            usageData: {
                labels: ['Estudiantes', 'Profesores'],
                datasets: [{
                    label: 'Uso de Chatbots',
                    data: [chatbotUsage.students, chatbotUsage.teachers],
                    backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(139, 92, 246, 0.8)'],
                    borderColor: ['rgb(59, 130, 246)', 'rgb(139, 92, 246)'],
                    borderWidth: 2
                }]
            },
            chatbotPopularity: {
                labels: Object.keys(chatbotCounts),
                datasets: [{
                    label: 'Frecuencia de Uso',
                    data: Object.values(chatbotCounts),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ],
                    borderWidth: 2
                }]
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={loadDashboardData}
                        className="px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                                <p className="text-gray-600">
                                    Bienvenido, {currentUser?.username}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Última actualización</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {new Date().toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Total Usuarios */}
                    {isAdmin && (
                        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Usuarios</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Users className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-green-500 font-medium">Sistema activo</span>
                            </div>
                        </div>
                    )}

                    {/* Encuestas de Estudiantes */}
                    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Encuestas Estudiantes</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalStudentSurveys}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <FileText className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600">{stats.studentsUsingChatbots} usan chatbots</span>
                        </div>
                    </div>

                    {/* Encuestas de Profesores */}
                    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Encuestas Profesores</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalTeacherSurveys}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <GraduationCap className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Activity className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-600">{stats.teachersUsingChatbots} usan chatbots</span>
                        </div>
                    </div>

                    {/* Promedio de Utilidad */}
                    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Utilidad Promedio</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.avgUsefulness}/5</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <TrendingUp className="w-8 h-8 text-yellow-600" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600">Calificación estudiantes</span>
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                {chartData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Gráfico de uso */}
                        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                                Uso de Chatbots
                            </h3>
                            <Bar 
                                data={chartData.usageData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    }
                                }}
                            />
                        </div>

                        {/* Gráfico de popularidad */}
                        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <PieChart className="w-6 h-6 text-purple-600" />
                                Chatbots Más Usados
                            </h3>
                            <Pie 
                                data={chartData.chatbotPopularity}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom'
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Acciones rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => navigate('/student/surveys')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FileText className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Encuestas Estudiantes</h3>
                                <p className="text-sm text-gray-600">Ver y crear encuestas</p>
                            </div>
                        </div>
                    </button>

                    {(currentUser?.role === 'teacher' || isAdmin) && (
                        <button
                            onClick={() => navigate('/teacher/surveys')}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <GraduationCap className="w-8 h-8 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Encuestas Profesores</h3>
                                    <p className="text-sm text-gray-600">Ver y crear encuestas</p>
                                </div>
                            </div>
                        </button>
                    )}

                    {isAdmin && (
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Users className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Gestión de Usuarios</h3>
                                    <p className="text-sm text-gray-600">Administrar usuarios</p>
                                </div>
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}