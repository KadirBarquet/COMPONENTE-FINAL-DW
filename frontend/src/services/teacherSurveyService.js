import api from './api';

const teacherSurveyService = {
  // Crear encuesta de profesor
  create: async (surveyData) => {
    try {
      const response = await api.post('/teacher-surveys', surveyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear encuesta' };
    }
  },

  // Obtener todas las encuestas (solo admin)
  getAll: async () => {
    try {
      const response = await api.get('/teacher-surveys');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener encuestas' };
    }
  },

  // Obtener encuesta por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/teacher-surveys/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener encuesta' };
    }
  },

  // Obtener mis encuestas
  getMysurveys: async () => {
    try {
      const response = await api.get('/teacher-surveys/my-surveys');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener tus encuestas' };
    }
  },

  // Actualizar encuesta
  update: async (id, surveyData) => {
    try {
      const response = await api.put(`/teacher-surveys/${id}`, surveyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar encuesta' };
    }
  },

  // Eliminar encuesta
  delete: async (id) => {
    try {
      const response = await api.delete(`/teacher-surveys/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar encuesta' };
    }
  },

  // Obtener estadísticas
  getStatistics: async () => {
    try {
      const response = await api.get('/teacher-surveys/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener estadísticas' };
    }
  }
};

export default teacherSurveyService;