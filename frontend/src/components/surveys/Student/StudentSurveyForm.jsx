import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FileText, 
  Save, 
  X, 
  AlertCircle,
  Loader,
  ArrowLeft,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import studentSurveyService from '../../../services/studentSurveyService';

export default function StudentSurveyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    has_used_chatbot: true,
    chatbots_used: [],
    usage_frequency: 'Ocasionalmente',
    usefulness_rating: 3,
    tasks_used_for: [],
    overall_experience: 3,
    preferred_chatbot: '',
    effectiveness_comparison: 'Más efectivo',
    will_continue_using: true,
    would_recommend: true,
    additional_comments: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [notification, setNotification] = useState(null);

  // Opciones para los selects
  const chatbotOptions = ['ChatGPT 3.5', 'ChatGPT 4', 'Bing Chat', 'Bard', 'Claude'];
  const frequencyOptions = ['Nunca', 'Casi nunca', 'Ocasionalmente', 'Frecuentemente', 'Muy frecuentemente'];
  const tasksOptions = [
    'Comprender conceptos',
    'Debugging',
    'Aprender nuevos lenguajes',
    'Explicando ejemplos de clase',
    'Generando código de ejercicios'
  ];
  const effectivenessOptions = [
    'Mucho menos efectivo',
    'Menos efectivo',
    'Igualmente efectivo',
    'Más efectivo',
    'Mucho más efectivo'
  ];

  useEffect(() => {
    if (isEditMode) {
      loadSurveyData();
    }
  }, [id]);

  const loadSurveyData = async () => {
    try {
      setLoadingData(true);
      const response = await studentSurveyService.getById(id);
      const survey = response.survey;
      
      setFormData({
        has_used_chatbot: survey.has_used_chatbot,
        chatbots_used: survey.chatbots_used || [],
        usage_frequency: survey.usage_frequency || 'Ocasionalmente',
        usefulness_rating: survey.usefulness_rating || 3,
        tasks_used_for: survey.tasks_used_for || [],
        overall_experience: survey.overall_experience || 3,
        preferred_chatbot: survey.preferred_chatbot || '',
        effectiveness_comparison: survey.effectiveness_comparison || 'Más efectivo',
        will_continue_using: survey.will_continue_using,
        would_recommend: survey.would_recommend,
        additional_comments: survey.additional_comments || ''
      });
    } catch (error) {
      showNotification(error.message || 'Error al cargar encuesta', 'error');
      setTimeout(() => navigate('/student/surveys'), 2000);
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
      if (!formData.preferred_chatbot) {
        newErrors.preferred_chatbot = 'Selecciona tu chatbot preferido';
      }
      if (formData.tasks_used_for.length === 0) {
        newErrors.tasks_used_for = 'Selecciona al menos una tarea';
      }
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
        await studentSurveyService.update(id, formData);
        showNotification('Encuesta actualizada exitosamente', 'success');
      } else {
        await studentSurveyService.create(formData);
        showNotification('Encuesta creada exitosamente', 'success');
      }

      setTimeout(() => navigate('/student/surveys'), 1500);
    } catch (error) {
      showNotification(error.message || 'Error al guardar encuesta', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student/surveys')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="bg-green-600 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditMode ? 'Editar Encuesta' : 'Nueva Encuesta de Estudiante'}
              </h1>
              <p className="text-gray-600">
                Encuesta sobre el uso de chatbots en programación
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
            {/* Sección 1: Uso General */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Uso General
              </h2>

              {/* ¿Has usado chatbot? */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Has usado un chatbot para ayudarte con tu aprendizaje de programación?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="has_used_chatbot"
                      checked={formData.has_used_chatbot === true}
                      onChange={() => setFormData({ ...formData, has_used_chatbot: true })}
                      className="w-4 h-4 text-green-600"
                    />
                    <span>Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="has_used_chatbot"
                      checked={formData.has_used_chatbot === false}
                      onChange={() => setFormData({ ...formData, has_used_chatbot: false })}
                      className="w-4 h-4 text-green-600"
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
                    <div className="grid grid-cols-2 gap-3">
                      {chatbotOptions.map(chatbot => (
                        <label key={chatbot} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.chatbots_used.includes(chatbot)}
                            onChange={() => handleArrayChange('chatbots_used', chatbot)}
                            className="w-4 h-4 text-green-600 rounded"
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

                  {/* Frecuencia de uso */}
                  <div className="mb-6">
                    <label htmlFor="usage_frequency" className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Con qué frecuencia los usas?
                    </label>
                    <select
                      id="usage_frequency"
                      name="usage_frequency"
                      value={formData.usage_frequency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {frequencyOptions.map(freq => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Sección 2: Utilidad */}
            {formData.has_used_chatbot && (
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Utilidad
                </h2>

                {/* Rating de utilidad */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Qué tan útiles encuentras los chatbots para aprender programación? (1-5)
                  </label>
                  <div className="flex items-center gap-4">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <label key={rating} className="flex flex-col items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="usefulness_rating"
                          value={rating}
                          checked={formData.usefulness_rating === rating}
                          onChange={(e) => setFormData({ ...formData, usefulness_rating: parseInt(e.target.value) })}
                          className="w-5 h-5 text-green-600"
                        />
                        <span className={`text-sm font-medium ${
                          formData.usefulness_rating === rating ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {rating}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Nada útil</span>
                    <span>Extremadamente útil</span>
                  </div>
                </div>

                {/* Tareas para las que se usa */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Para qué tareas específicas usas chatbots? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {tasksOptions.map(task => (
                      <label key={task} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.tasks_used_for.includes(task)}
                          onChange={() => handleArrayChange('tasks_used_for', task)}
                          className="w-4 h-4 text-green-600 rounded"
                        />
                        <span className="text-sm">{task}</span>
                      </label>
                    ))}
                  </div>
                  {errors.tasks_used_for && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.tasks_used_for}
                    </p>
                  )}
                </div>

                {/* Chatbot preferido */}
                <div className="mb-6">
                  <label htmlFor="preferred_chatbot" className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuál es tu chatbot preferido? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="preferred_chatbot"
                    name="preferred_chatbot"
                    value={formData.preferred_chatbot}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.preferred_chatbot ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona uno...</option>
                    {chatbotOptions.map(chatbot => (
                      <option key={chatbot} value={chatbot}>{chatbot}</option>
                    ))}
                  </select>
                  {errors.preferred_chatbot && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.preferred_chatbot}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Sección 3: Experiencia */}
            {formData.has_used_chatbot && (
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Experiencia
                </h2>

                {/* Rating de experiencia general */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Cómo calificarías tu experiencia general con los chatbots? (1-5)
                  </label>
                  <div className="flex items-center gap-4">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <label key={rating} className="flex flex-col items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="overall_experience"
                          value={rating}
                          checked={formData.overall_experience === rating}
                          onChange={(e) => setFormData({ ...formData, overall_experience: parseInt(e.target.value) })}
                          className="w-5 h-5 text-green-600"
                        />
                        <span className={`text-sm font-medium ${
                          formData.overall_experience === rating ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {rating}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Muy mala</span>
                    <span>Excelente</span>
                  </div>
                </div>

                {/* Comparación de efectividad */}
                <div className="mb-6">
                  <label htmlFor="effectiveness_comparison" className="block text-sm font-medium text-gray-700 mb-2">
                    Comparado con otros recursos (libros, tutoriales, profesores), ¿cómo calificarías la efectividad de los chatbots?
                  </label>
                  <select
                    id="effectiveness_comparison"
                    name="effectiveness_comparison"
                    value={formData.effectiveness_comparison}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {effectivenessOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Sección 4: Uso Futuro */}
            {formData.has_used_chatbot && (
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Uso Futuro
                </h2>

                {/* ¿Continuarás usando? */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Planeas continuar usando chatbots para tus estudios?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="will_continue_using"
                        checked={formData.will_continue_using === true}
                        onChange={() => setFormData({ ...formData, will_continue_using: true })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span>Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="will_continue_using"
                        checked={formData.will_continue_using === false}
                        onChange={() => setFormData({ ...formData, will_continue_using: false })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* ¿Recomendarías? */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Recomendarías chatbots a otros estudiantes?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="would_recommend"
                        checked={formData.would_recommend === true}
                        onChange={() => setFormData({ ...formData, would_recommend: true })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span>Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="would_recommend"
                        checked={formData.would_recommend === false}
                        onChange={() => setFormData({ ...formData, would_recommend: false })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Comentarios adicionales */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-green-600" />
                Comentarios Adicionales
              </h2>

              <div>
                <label htmlFor="additional_comments" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Tienes algún comentario adicional sobre tu experiencia usando chatbots?
                </label>
                <textarea
                  id="additional_comments"
                  name="additional_comments"
                  value={formData.additional_comments}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Comparte tu experiencia, sugerencias o cualquier comentario..."
                />
                <p className="text-gray-500 text-xs mt-1">Opcional</p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/student/surveys')}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
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