import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Settings Component
import Settings from './components/Settings';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';

// Dashboard Components
import Home from './components/dashboard/Home';
import Dashboard from './components/dashboard/Dashboard';

// User Components
import User from './components/users/User';
import UserDetail from './components/users/UserDetail';
import UserForm from './components/users/UserForm';

// Student Survey Components
import StudentSurvey from './components/surveys/Student/StudentSurvey';
import StudentSurveyDetail from './components/surveys/Student/StudetSurveyDetail';
import StudentSurveyForm from './components/surveys/Student/StudentSurveyForm';

// Teacher Survey Components
import TeacherSurvey from './components/surveys/Teacher/TeacherSurvey';
import TeacherSurveyDetail from './components/surveys/Teacher/TeacherSurveyDetail';
import TeacherSurveyForm from './components/surveys/Teacher/TeacherSurveyForm';

// Protected Route
import ProtectedRoute from './context/ProtectedRoute';

// Auth Service
import authService from './services/authService';

function App() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        {/* Navbar - visible en todas las páginas excepto login y register */}
        <Routes>
          <Route path="/login" element={null} />
          <Route path="/register" element={null} />
          <Route path="*" element={<Navbar />} />
        </Routes>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            {/* Rutas Públicas */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Register />
                )
              }
            />

            {/* Ruta de Inicio - Accesible para todos */}
            <Route path="/" element={<Home />} />

            {/* Rutas Protegidas - Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute> 
              }
            />

            <Route 
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute> 
              }
            />

            {/* Rutas de Administración - Solo Admin */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <User />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/new"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/edit/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Rutas de Encuestas de Estudiantes - Estudiantes y Admin */}
            <Route
              path="/student/surveys"
              element={
                <ProtectedRoute requiredRole={['student', 'admin']}>
                  <StudentSurvey />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/surveys/new"
              element={
                <ProtectedRoute requiredRole={['student', 'admin']}>
                  <StudentSurveyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/surveys/edit/:id"
              element={
                <ProtectedRoute requiredRole={['student', 'admin']}>
                  <StudentSurveyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/surveys/:id"
              element={
                <ProtectedRoute requiredRole={['student', 'admin']}>
                  <StudentSurveyDetail />
                </ProtectedRoute>
              }
            />

            {/* Rutas de Encuestas de Profesores - Profesores y Admin */}
            <Route
              path="/teacher/surveys"
              element={
                <ProtectedRoute requiredRole={['teacher', 'admin']}>
                  <TeacherSurvey />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/surveys/new"
              element={
                <ProtectedRoute requiredRole={['teacher', 'admin']}>
                  <TeacherSurveyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/surveys/edit/:id"
              element={
                <ProtectedRoute requiredRole={['teacher', 'admin']}>
                  <TeacherSurveyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/surveys/:id"
              element={
                <ProtectedRoute requiredRole={['teacher', 'admin']}>
                  <TeacherSurveyDetail />
                </ProtectedRoute>
              }
            />

            {/* Ruta 404 - Página no encontrada */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                  <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
                    <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Página no encontrada
                    </h2>
                    <p className="text-gray-600 mb-6">
                      La página que buscas no existe o ha sido movida.
                    </p>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Volver al Inicio
                    </button>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer - visible en todas las páginas excepto login y register */}
        <Routes>
          <Route path="/login" element={null} />
          <Route path="/register" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;