import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Registro de usuario
export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Verificar si el email ya existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: 'El email ya está registrado'
            });
        }

        // Crear usuario
        const newUser = await User.create({
            username,
            email,
            password,
            role: role || 'student'
        });

        // Generar token
        const token = generateToken(newUser.id);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

// Login de usuario
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user.id);

        res.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

// Obtener perfil del usuario actual
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
};