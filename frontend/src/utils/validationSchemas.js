import * as yup from 'yup';

// Esquema de validación para registro de usuario
export const registerSchema = yup.object().shape({
    username: yup
        .string()
        .required('El nombre de usuario es requerido')
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(50, 'El nombre de usuario no puede tener más de 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),

    email: yup
        .string()
        .required('El correo electrónico es requerido')
        .email('El correo electrónico no es válido'),

    password: yup
        .string()
        .required('La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),

    confirmPassword: yup
        .string()
        .required('Debes confirmar tu contraseña')
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),

    role: yup
        .string()
        .oneOf(['student', 'teacher', 'admin'], 'Rol inválido')
        .required('El rol es requerido')
});

// Esquema de validación para login
export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required('El correo electrónico es requerido')
        .email('El correo electrónico no es válido'),

    password: yup
        .string()
        .required('La contraseña es requerida')
});

// Esquema de validación para actualizar usuario
export const updateUserSchema = yup.object().shape({
    username: yup
        .string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(50, 'El nombre de usuario no puede tener más de 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),

    email: yup
        .string()
        .email('El correo electrónico no es válido'),

    password: yup
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// Esquema de validación para encuesta de estudiante
export const studentSurveySchema = yup.object().shape({
    has_used_chatbot: yup
        .boolean()
        .required('Debes indicar si has usado chatbots'),

    chatbots_used: yup
        .array()
        .when('has_used_chatbot', {
            is: true,
            then: (schema) => schema
                .min(1, 'Selecciona al menos un chatbot')
                .required('Selecciona los chatbots que has usado'),
            otherwise: (schema) => schema.notRequired()
        }),

    usage_frequency: yup
        .string()
        .when('has_used_chatbot', {
            is: true,
            then: (schema) => schema.required('Selecciona la frecuencia de uso'),
            otherwise: (schema) => schema.notRequired()
        }),

    usefulness_rating: yup
        .number()
        .min(1, 'La calificación debe ser entre 1 y 5')
        .max(5, 'La calificación debe ser entre 1 y 5'),

    tasks_used_for: yup
        .array()
        .when('has_used_chatbot', {
            is: true,
            then: (schema) => schema
                .min(1, 'Selecciona al menos una tarea')
                .required('Selecciona las tareas para las que usas chatbots'),
            otherwise: (schema) => schema.notRequired()
        }),

    preferred_chatbot: yup
        .string()
        .when('has_used_chatbot', {
            is: true,
            then: (schema) => schema.required('Selecciona tu chatbot preferido'),
            otherwise: (schema) => schema.notRequired()
        })
});

// Esquema de validación para encuesta de profesor
export const teacherSurveySchema = yup.object().shape({
    has_used_chatbot: yup
        .boolean()
        .required('Debes indicar si has usado chatbots'),

    chatbots_used: yup
        .array()
        .when('has_used_chatbot', {
            is: true,
            then: (schema) => schema
                .min(1, 'Selecciona al menos un chatbot')
                .required('Selecciona los chatbots que has usado'),
            otherwise: (schema) => schema.notRequired()
        }),

    courses_used: yup
        .array()
        .when('has_used_chatbot', {
            is: true,
            then: (schema) => schema
                .min(1, 'Selecciona al menos un curso')
                .required('Selecciona los cursos donde has usado chatbots'),
            otherwise: (schema) => schema.notRequired()
        }),

    purposes: yup
        .array()
        .when('has_used_chatbot', {
            is: true,
            then: (schema) => schema
                .min(1, 'Selecciona al menos un propósito')
                .required('Selecciona los propósitos de uso'),
            otherwise: (schema) => schema.notRequired()
        }),

    country: yup
        .string()
        .required('El país es requerido'),

    likelihood_future_use: yup
        .string()
        .required('Selecciona la probabilidad de uso futuro')
});

// Función auxiliar para validar un esquema
export const validateSchema = async (schema, data) => {
    try {
        await schema.validate(data, { abortEarly: false });
        return { isValid: true, errors: {} };
    } catch (err) {
        const errors = {};
        err.inner.forEach((error) => {
            errors[error.path] = error.message;
        });
        return { isValid: false, errors };
    }
};

// Validador personalizado para arrays
export const validateArray = (value, minLength = 1, errorMessage) => {
    if (!Array.isArray(value) || value.length < minLength) {
        return errorMessage || `Debe seleccionar al menos ${minLength} opción(es)`;
    }
    return null;
};

// Validador personalizado para email
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'El correo electrónico no es válido';
    }
    return null;
};

// Validador personalizado para contraseñas
export const validatePassword = (password, minLength = 6) => {
    if (password.length < minLength) {
        return `La contraseña debe tener al menos ${minLength} caracteres`;
    }
    return null;
};

// Validador personalizado para confirmación de contraseña
export const validatePasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden';
    }
    return null;
};

export default {
    registerSchema,
    loginSchema,
    updateUserSchema,
    studentSurveySchema,
    teacherSurveySchema,
    validateSchema,
    validateArray,
    validateEmail,
    validatePassword,
    validatePasswordMatch
};