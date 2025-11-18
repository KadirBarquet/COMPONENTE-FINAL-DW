import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';
import { validateRegister, validateUserUpdate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener todos los usuarios (solo admin)
router.get('/', verifyAdmin, getAllUsers);

// Obtener usuario por ID (admin o el propio usuario)
router.get('/:id', getUserById);

// Crear usuario (solo admin)
router.post('/', verifyAdmin, validateRegister, createUser);

// Actualizar usuario (admin o el propio usuario)
router.put('/:id', validateUserUpdate, updateUser);

// Eliminar usuario (solo admin)
router.delete('/:id', verifyAdmin, deleteUser);

export default router;