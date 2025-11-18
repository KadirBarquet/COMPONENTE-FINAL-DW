import User from '../models/User.js';

// Obtener todos los usuarios (solo admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        res.json({
            message: 'Usuarios obtenidos exitosamente',
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            message: 'Usuario obtenido exitosamente',
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

// Crear usuario (solo admin)
export const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Verificar si el email ya existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: 'El email ya está registrado'
            });
        }

        const newUser = await User.create({
            username,
            email,
            password,
            role: role || 'student'
        });

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        // Verificar que el usuario existe
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        // Si se actualiza el email, verificar que no esté en uso
        if (email && email !== existingUser.email) {
            const emailInUse = await User.findByEmail(email);
            if (emailInUse) {
                return res.status(400).json({
                    message: 'El email ya está en uso'
                });
            }
        }

        const updatedUser = await User.update(id, { username, email });

        res.json({
            message: 'Usuario actualizado exitosamente',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el usuario existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        // No permitir que el usuario se elimine a sí mismo
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                message: 'No puedes eliminar tu propia cuenta'
            });
        }

        await User.delete(id);

        res.json({
            message: '✅ Usuario eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};