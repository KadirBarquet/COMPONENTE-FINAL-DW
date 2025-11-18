import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verificar token JWT
export const verifyToken = async (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'No se proporcionó token de autenticación'
            });
        }

        const token = authHeader.substring(7); // Remover "Bearer "

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuario
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: 'Usuario no encontrado'
            });
        }

        // Agregar usuario al request
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Token inválido'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expirado'
            });
        }
        return res.status(500).json({
            message: 'Error al verificar token',
            error: error.message
        });
    }
};

// Verificar rol de admin
export const verifyAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Acceso denegado. Se requiere rol de administrador'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error al verificar permisos',
            error: error.message
        });
    }
};

// Verificar rol de profesor
export const verifyTeacher = (req, res, next) => {
    try {
        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Acceso denegado. Se requiere rol de profesor'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error al verificar permisos',
            error: error.message
        });
    }
};

// Verificar que el usuario accede solo a sus propios recursos
export const verifyOwnership = (req, res, next) => {
    try {
        const resourceUserId = parseInt(req.params.userId || req.body.user_id);

        // Admin puede acceder a todo
        if (req.user.role === 'admin') {
            return next();
        }

        // Verificar que el usuario accede solo a sus recursos
        if (req.user.id !== resourceUserId) {
            return res.status(403).json({
                message: 'No tienes permiso para acceder a este recurso'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error al verificar propiedad del recurso',
            error: error.message
        });
    }
};