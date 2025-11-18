import express from 'express';
import {
    createTeacherSurvey,
    getAllTeacherSurveys,
    getTeacherSurveyById,
    getMyTeacherSurveys,
    updateTeacherSurvey,
    deleteTeacherSurvey,
    getTeacherSurveyStatistics
} from '../controllers/teacherSurveyController.js';
import { verifyToken, verifyAdmin, verifyTeacher } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas para profesores y admin
router.post('/', verifyTeacher, createTeacherSurvey);
router.get('/my-surveys', verifyTeacher, getMyTeacherSurveys);
router.get('/statistics', getTeacherSurveyStatistics);

// Rutas específicas
router.get('/:id', getTeacherSurveyById);
router.put('/:id', updateTeacherSurvey);
router.delete('/:id', deleteTeacherSurvey);

// Rutas solo para admin
router.get('/', verifyAdmin, getAllTeacherSurveys);

export default router;