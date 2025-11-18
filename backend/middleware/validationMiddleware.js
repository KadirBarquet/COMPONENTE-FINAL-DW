export const validateRegister = (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        // Validar campos requeridos
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Todos los campos son requeridos'
            });
        }

        // Validar username
        if (username.length < 3 || username.length > 50) {
            return res.status(400).json({
                message: 'El username debe tener entre 3 y 50 caracteres'
            });
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Email inválido'
            });
        }

        // Validar contraseña
        if (password.length < 6) {
            return res.status(400).json({
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Validar rol
        const validRoles = ['student', 'teacher', 'admin'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({
                message: 'Rol inválido. Debe ser: student, teacher o admin'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error en validación',
            error: error.message
        });
    }
};

// Validar datos de login
export const validateLogin = (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email y contraseña son requeridos'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Email inválido'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error en validación',
            error: error.message
        });
    }
};

// Validar actualización de usuario
export const validateUserUpdate = (req, res, next) => {
    try {
        const { username, email } = req.body;

        if (!username && !email) {
            return res.status(400).json({
                message: 'Debe proporcionar al menos un campo para actualizar'
            });
        }

        if (username && (username.length < 3 || username.length > 50)) {
            return res.status(400).json({
                message: 'El username debe tener entre 3 y 50 caracteres'
            });
        }

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: 'Email inválido'
                });
            }
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error en validación',
            error: error.message
        });
    }
};