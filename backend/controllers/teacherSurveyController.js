import TeacherSurvey from '../models/TeacherSurvey.js';

// Crear encuesta de profesor
export const createTeacherSurvey = async (req, res) => {
    try {
        const surveyData = {
            user_id: req.user.id,
            ...req.body
        };

        const newSurvey = await TeacherSurvey.create(surveyData);

        res.status(201).json({
            message: 'Encuesta creada exitosamente',
            survey: newSurvey
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear encuesta',
            error: error.message
        });
    }
};

// Obtener todas las encuestas (solo admin)
export const getAllTeacherSurveys = async (req, res) => {
    try {
        const surveys = await TeacherSurvey.findAll();

        res.json({
            message: 'Encuestas obtenidas exitosamente',
            count: surveys.length,
            surveys
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener encuestas',
            error: error.message
        });
    }
};

// Obtener encuesta por ID
export const getTeacherSurveyById = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await TeacherSurvey.findById(id);

        if (!survey) {
            return res.status(404).json({
                message: 'Encuesta no encontrada'
            });
        }

        res.json({
            message: 'Encuesta obtenida exitosamente',
            survey
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener encuesta',
            error: error.message
        });
    }
};

// Obtener encuestas del usuario actual
export const getMyTeacherSurveys = async (req, res) => {
    try {
        const surveys = await TeacherSurvey.findByUserId(req.user.id);

        res.json({
            message: 'Tus encuestas obtenidas exitosamente',
            count: surveys.length,
            surveys
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener tus encuestas',
            error: error.message
        });
    }
};

// Actualizar encuesta
export const updateTeacherSurvey = async (req, res) => {
    try {
        const { id } = req.params;

        const survey = await TeacherSurvey.findById(id);
        if (!survey) {
            return res.status(404).json({
                message: 'Encuesta no encontrada'
            });
        }

        // Verificar permisos
        if (survey.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'No tienes permiso para editar esta encuesta'
            });
        }

        const updatedSurvey = await TeacherSurvey.update(id, req.body);

        res.json({
            message: 'Encuesta actualizada exitosamente',
            survey: updatedSurvey
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar encuesta',
            error: error.message
        });
    }
};

// Eliminar encuesta
export const deleteTeacherSurvey = async (req, res) => {
    try {
        const { id } = req.params;

        const survey = await TeacherSurvey.findById(id);
        if (!survey) {
            return res.status(404).json({
                message: 'Encuesta no encontrada'
            });
        }

        // Verificar permisos
        if (survey.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'No tienes permiso para eliminar esta encuesta'
            });
        }

        await TeacherSurvey.delete(id);

        res.json({
            message: 'Encuesta eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar encuesta',
            error: error.message
        });
    }
};

// Obtener estadísticas
export const getTeacherSurveyStatistics = async (req, res) => {
    try {
        const statistics = await TeacherSurvey.getStatistics();

        res.json({
            message: 'Estadísticas obtenidas exitosamente',
            statistics
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};