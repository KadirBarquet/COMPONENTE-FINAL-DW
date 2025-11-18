import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Rutas protegidas
router.get('/profile', verifyToken, getProfile);

export default router;