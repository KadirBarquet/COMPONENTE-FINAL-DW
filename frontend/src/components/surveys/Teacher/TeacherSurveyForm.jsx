import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  GraduationCap, 
  Save, 
  X, 
  AlertCircle,
  Loader,
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Globe,
  Building2
} from 'lucide-react';
import teacherSurveyService from '../../../services/teacherSurveyService';

export default function TeacherSurveyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    has_used_chatbot: true,
    chatbots_used: [],
    courses_used: [],
    purposes: [],
    outcomes: [],
    challenges: [],
    likelihood_future_use: 'Muy probable',
    advantages: [],
    concerns: [],
    resources_needed: [],
    age_range: '25-34 años',
    institution_type: 'Universidad Pública',
    country: '',
    years_experience: '3-5 años',
    additional_comments: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [notification, setNotification] = useState(null);

  // Opciones para los selects y checkboxes
  const chatbotOptions = ['ChatGPT 3.5', 'ChatGPT 4', 'Bing Chat', 'Blackbox', 'Claude', 'Gemini'];
  
  const coursesOptions = [
    'Programación',
    'Introducción a la Ingeniería de Software',
    'Ingeniería de Requisitos de Software',
    'Diseño de Software',
    'Arquitectura de Software',
    'Desarrollo Dirigido por Modelos',
    'Pruebas de Software',
    'Gestión de Proyectos de Software',
    'Calidad de Software',
    'Mantenimiento de Software'
  ];

  const purposesOptions = [
    'Brindar apoyo a los estudiantes en la resolución de ejercicios.',
    'Proporcionar retroalimentación personalizada a los estudiantes en el código.',
    'Guía a los estudiantes en el proceso de aprendizaje.',
    'Detectar errores y problemas comunes.',
    'Personalizar la velocidad de aprendizaje para cada estudiante.'
  ];

  const outcomesOptions = [
    'Mejora en el rendimiento académico de los estudiantes.',
    'Aumento de la participación y interacción en la clase.',
    'Reducción de la carga laboral del profesor.',
    'Mejora en la satisfacción del estudiante.'
  ];

  const challengesOptions = [
    'Dificultad para configurar o integrar el chatbot.',
    'Limitaciones en las capacidades del chatbot.',
    'Falta de precisión en las respuestas.',
    'Dificultad para adaptar el chatbot a diferentes niveles.',
    'Falta de recursos o soporte técnico.'
  ];

  const likelihoodOptions = ['Muy probable', 'Probable', 'Imposible', 'Muy improbable'];

  const advantagesOptions = [
    'Personalización del aprendizaje',
    '24/7 soporte para los estudiantes',
    'Detección temprana de errores',
    'Liberación de tiempo para los profesores',
    'Fomento de la autonomía y la velocidad de aprendizaje individual'
  ];

  const concernsOptions = [
    'Costos de implementación y mantenimiento',
    'Posible impacto negativo en la calidad del aprendizaje',
    'Dificultad para evaluar la aprendizaje real de los estudiantes',
    'Problemas de privacidad y seguridad de los datos',
    'Resistencia o falta de aceptación',
    'Errores técnicos de respuesta de los chatbots'
  ];

  const resourcesOptions = [
    'Capacitación y educación sobre los chatbots de IA',
    'Guías y documentación',
    'Plataformas o herramientas educativas integradas con AI',
    'Soporte técnico y asistencia',
    'Investigación y casos de estudio',
    'Formación en el uso de las solicitudes'
  ];

  const ageRangeOptions = ['18-24 años', '25-34 años', '35-44 años', '45-54 años', '55 años o más antiguos'];
  const institutionOptions = ['Universidad Pública', 'Universidad Privada', 'Otro'];
  const experienceOptions = ['0-2 años', '3-5 años', '6-10 años', '11-15 años', 'Más de 15 años'];

  useEffect(() => {
    if (isEditMode) {
      loadSurveyData();
    }
  }, [id]);

  const loadSurveyData = async () => {
    try {
      setLoadingData(true);
      const response = await teacherSurveyService.getById(id);
      const survey = response.survey;
      
      setFormData({
        has_used_chatbot: survey.has_used_chatbot,
        chatbots_used: survey.chatbots_used || [],
        courses_used: survey.courses_used || [],
        purposes: survey.purposes || [],
        outcomes: survey.outcomes || [],
        challenges: survey.challenges || [],
        likelihood_future_use: survey.likelihood_future_use || 'Muy probable',
        advantages: survey.advantages || [],
        concerns: survey.concerns || [],
        resources_needed: survey.resources_needed || [],
        age_range: survey.age_range || '25-34 años',
        institution_type: survey.institution_type || 'Universidad Pública',
        country: survey.country || '',
        years_experience: survey.years_experience || '3-5 años',
        additional_comments: survey.additional_comments || ''
      });
    } catch (error) {
      showNotification(error.message || 'Error al cargar encuesta', 'error');
      setTimeout(() => navigate('/teacher/surveys'), 2000);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleArrayChange = (name, value) => {
    const currentArray = formData[name];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFormData({ ...formData, [name]: newArray });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.has_used_chatbot) {
      if (formData.chatbots_used.length === 0) {
        newErrors.chatbots_used = 'Selecciona al menos un chatbot';
      }
      if (formData.courses_used.length === 0) {
        newErrors.courses_used = 'Selecciona al menos un curso';
      }
      if (formData.purposes.length === 0) {
        newErrors.purposes = 'Selecciona al menos un propósito';
      }
    }

    if (!formData.country) {
      newErrors.country = 'El país es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('Por favor corrige los errores del formulario', 'error');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await teacherSurveyService.update(id, formData);
        showNotification('Encuesta actualizada exitosamente', 'success');
      } else {
        await teacherSurveyService.create(formData);
        showNotification('Encuesta creada exitosamente', 'success');
      }

      setTimeout(() => navigate('/teacher/surveys'), 1500);
    } catch (error) {
      showNotification(error.message || 'Error al guardar encuesta', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/teacher/surveys')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="bg-indigo-600 p-3 rounded-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditMode ? 'Editar Encuesta' : 'Nueva Encuesta de Profesor'}
              </h1>
              <p className="text-gray-600">
                Encuesta sobre el uso de chatbots de IA en la enseñanza
              </p>
            </div>
          </div>
        </div>

        {/* Notificación */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg shadow-lg animate-slide-up flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <AlertCircle className="w-5 h-5" />
            {notification.message}
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-md p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sección 1: Experiencia Previa */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
                Experiencia Previa
              </h2>

              {/* ¿Has usado chatbot? */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Has usado chatbots de IA en tus clases de ingeniería de software?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="has_used_chatbot"
                      checked={formData.has_used_chatbot === true}
                      onChange={() => setFormData({ ...formData, has_used_chatbot: true })}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span>Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="has_used_chatbot"
                      checked={formData.has_used_chatbot === false}
                      onChange={() => setFormData({ ...formData, has_used_chatbot: false })}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.has_used_chatbot && (
                <>
                  {/* Chatbots usados */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ¿Qué chatbots has usado? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {chatbotOptions.map(chatbot => (
                        <label key={chatbot} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.chatbots_used.includes(chatbot)}
                            onChange={() => handleArrayChange('chatbots_used', chatbot)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span className="text-sm">{chatbot}</span>
                        </label>
                      ))}
                    </div>
                    {errors.chatbots_used && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.chatbots_used}
                      </p>
                    )}
                  </div>

                  {/* Cursos donde se usó */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ¿En qué cursos o etapas has usado chatbots? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {coursesOptions.map(course => (
                        <label key={course} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.courses_used.includes(course)}
                            onChange={() => handleArrayChange('courses_used', course)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span className="text-sm">{course}</span>
                        </label>
                      ))}
                    </div>
                    {errors.courses_used && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.courses_used}
                      </p>
                    )}
                  </div>

                  {/* Propósitos */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ¿Para qué propósito usaste los chatbots? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {purposesOptions.map(purpose => (
                        <label key={purpose} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.purposes.includes(purpose)}
                            onChange={() => handleArrayChange('purposes', purpose)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span className="text-sm">{purpose}</span>
                        </label>
                      ))}
                    </div>
                    {errors.purposes && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.purposes}
                      </p>
                    )}
                  </div>

                  {/* Resultados */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ¿Cuáles fueron los resultados?
                    </label>
                    <div className="space-y-2">
                      {outcomesOptions.map(outcome => (
                        <label key={outcome} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.outcomes.includes(outcome)}
                            onChange={() => handleArrayChange('outcomes', outcome)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span className="text-sm">{outcome}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Desafíos */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ¿Qué desafíos o dificultades encontraste?
                    </label>
                    <div className="space-y-2">
                      {challengesOptions.map(challenge => (
                        <label key={challenge} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.challenges.includes(challenge)}
                            onChange={() => handleArrayChange('challenges', challenge)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span className="text-sm">{challenge}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sección 2: Percepción y Perspectivas */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
                Percepción y Perspectivas
              </h2>

              {/* Probabilidad de uso futuro */}
              <div className="mb-6">
                <label htmlFor="likelihood_future_use" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Qué tan probable es que uses o continúes usando chatbots de IA en el futuro?
                </label>
                <select
                  id="likelihood_future_use"
                  name="likelihood_future_use"
                  value={formData.likelihood_future_use}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {likelihoodOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Ventajas */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Cuáles serían las principales ventajas?
                </label>
                <div className="space-y-2">
                  {advantagesOptions.map(advantage => (
                    <label key={advantage} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.advantages.includes(advantage)}
                        onChange={() => handleArrayChange('advantages', advantage)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm">{advantage}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preocupaciones */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Cuáles serían tus principales preocupaciones?
                </label>
                <div className="space-y-2">
                  {concernsOptions.map(concern => (
                    <label key={concern} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.concerns.includes(concern)}
                        onChange={() => handleArrayChange('concerns', concern)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm">{concern}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recursos necesarios */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Qué recursos o soporte necesitarías?
                </label>
                <div className="space-y-2">
                  {resourcesOptions.map(resource => (
                    <label key={resource} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.resources_needed.includes(resource)}
                        onChange={() => handleArrayChange('resources_needed', resource)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm">{resource}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sección 3: Información Demográfica */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-indigo-600" />
                Información Demográfica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rango de edad */}
                <div>
                  <label htmlFor="age_range" className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de Edad
                  </label>
                  <select
                    id="age_range"
                    name="age_range"
                    value={formData.age_range}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {ageRangeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Tipo de institución */}
                <div>
                  <label htmlFor="institution_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Institución
                  </label>
                  <select
                    id="institution_type"
                    name="institution_type"
                    value={formData.institution_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {institutionOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* País */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    País <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: México, Ecuador, España"
                    />
                  </div>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.country}
                    </p>
                  )}
                </div>

                {/* Años de experiencia */}
                <div>
                  <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Años de Experiencia Enseñando
                  </label>
                  <select
                    id="years_experience"
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {experienceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Comentarios adicionales */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
                Comentarios Adicionales
              </h2>

              <div>
                <label htmlFor="additional_comments" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Tienes alguna recomendación o sugerencia para mejorar el uso de chatbots de IA en la enseñanza?
                </label>
                <textarea
                  id="additional_comments"
                  name="additional_comments"
                  value={formData.additional_comments}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Comparte tu experiencia, sugerencias o cualquier comentario..."
                />
                <p className="text-gray-500 text-xs mt-1">Opcional</p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/teacher/surveys')}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {isEditMode ? 'Actualizando...' : 'Guardando...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditMode ? 'Actualizar Encuesta' : 'Guardar Encuesta'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}