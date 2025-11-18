import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Menu,
    X,
    User,
    LogOut,
    Home,
    FileText,
    GraduationCap,
    Users,
    BarChart3,
    Settings,
    ChevronDown
} from 'lucide-react';
import authService from '../../services/authService';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const currentUser = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const NavLink = ({ to, icon: Icon, children, onClick }) => (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(to)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{children}</span>
        </Link>
    );

    const MobileNavLink = ({ to, icon: Icon, children, onClick }) => (
        <Link
            to={to}
            onClick={() => {
                setIsOpen(false);
                onClick && onClick();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(to)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{children}</span>
        </Link>
    );

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'teacher': return 'Profesor';
            case 'student': return 'Estudiante';
            default: return 'Usuario';
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'teacher': return 'bg-blue-100 text-blue-800';
            case 'student': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden md:block">
                            <span className="text-xl font-bold text-gray-800">Chatbots Survey</span>
                            <p className="text-xs text-gray-500">Education System</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center gap-2">
                            <NavLink to="/" icon={Home}>
                                Inicio
                            </NavLink>

                            {currentUser?.role === 'admin' && (
                                <>
                                    <NavLink to="/admin/users" icon={Users}>
                                        Usuarios
                                    </NavLink>
                                    <NavLink to="/admin/dashboard" icon={BarChart3}>
                                        Dashboard
                                    </NavLink>
                                </>
                            )}

                            {(currentUser?.role === 'student' || currentUser?.role === 'admin') && (
                                <NavLink to="/student/surveys" icon={FileText}>
                                    Encuestas Estudiantes
                                </NavLink>
                            )}

                            {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                                <NavLink to="/teacher/surveys" icon={GraduationCap}>
                                    Encuestas Profesores
                                </NavLink>
                            )}
                        </div>
                    )}

                    {/* User Menu / Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-gray-800">
                                                {currentUser?.username}
                                            </p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(currentUser?.role)}`}>
                                                {getRoleLabel(currentUser?.role)}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''
                                            }`} />
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowUserMenu(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20 animate-fade-in">
                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {currentUser?.username}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {currentUser?.email}
                                                </p>
                                            </div>

                                            <Link
                                                to="/profile"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                                            >
                                                <User className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm text-gray-700">Mi Perfil</span>
                                            </Link>

                                            <Link
                                                to="/settings"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                                            >
                                                <Settings className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm text-gray-700">Configuración</span>
                                            </Link>

                                            <div className="border-t border-gray-200 my-2" />

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="text-sm font-medium">Cerrar Sesión</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-medium transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-gray-600" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white animate-slide-up">
                    <div className="px-4 py-4 space-y-2">
                        {isAuthenticated ? (
                            <>
                                {/* User Info */}
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-4">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {currentUser?.username}
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(currentUser?.role)}`}>
                                            {getRoleLabel(currentUser?.role)}
                                        </span>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <MobileNavLink to="/" icon={Home}>
                                    Inicio
                                </MobileNavLink>

                                {currentUser?.role === 'admin' && (
                                    <>
                                        <MobileNavLink to="/admin/users" icon={Users}>
                                            Usuarios
                                        </MobileNavLink>
                                        <MobileNavLink to="/admin/dashboard" icon={BarChart3}>
                                            Dashboard
                                        </MobileNavLink>
                                    </>
                                )}

                                {(currentUser?.role === 'student' || currentUser?.role === 'admin') && (
                                    <MobileNavLink to="/student/surveys" icon={FileText}>
                                        Encuestas Estudiantes
                                    </MobileNavLink>
                                )}

                                {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                                    <MobileNavLink to="/teacher/surveys" icon={GraduationCap}>
                                        Encuestas Profesores
                                    </MobileNavLink>
                                )}

                                <div className="border-t border-gray-200 my-2" />

                                <MobileNavLink to="/profile" icon={User}>
                                    Mi Perfil
                                </MobileNavLink>

                                <MobileNavLink to="/settings" icon={Settings}>
                                    Configuración
                                </MobileNavLink>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Cerrar Sesión</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full px-4 py-3 text-center text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium transition-all"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}