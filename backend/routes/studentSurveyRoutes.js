import express from 'express';
import {
    createStudentSurvey,
    getAllStudentSurveys,
    getStudentSurveyById,
    getMyStudentSurveys,
    updateStudentSurvey,
    deleteStudentSurvey,
    getStudentSurveyStatistics
} from '../controllers/studentSurveyController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas públicas para usuarios autenticados
router.post('/', createStudentSurvey);
router.get('/my-surveys', getMyStudentSurveys);
router.get('/statistics', getStudentSurveyStatistics);

// Rutas específicas
router.get('/:id', getStudentSurveyById);
router.put('/:id', updateStudentSurvey);
router.delete('/:id', deleteStudentSurvey);

// Rutas solo para admin
router.get('/', verifyAdmin, getAllStudentSurveys);

export default router;