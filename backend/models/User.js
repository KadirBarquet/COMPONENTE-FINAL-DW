import { query } from '../config/database.js';
import bcrypt from 'bcrypt';

class User {
    // Crear nuevo usuario
    static async create({ username, email, password, role = 'student' }) {
        try {
            // Hash de la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const text = `
        INSERT INTO users (username, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, role, created_at
      `;
            const values = [username, email, hashedPassword, role];

            const result = await query(text, values);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') { // Código de violación de unicidad en PostgreSQL
                throw new Error('El email o username ya está registrado');
            }
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const text = 'SELECT * FROM users WHERE email = $1';
            const result = await query(text, [email]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al buscar usuario: ${error.message}`);
        }
    }

    // Buscar usuario por ID
    static async findById(id) {
        try {
            const text = 'SELECT id, username, email, role, created_at FROM users WHERE id = $1';
            const result = await query(text, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al buscar usuario: ${error.message}`);
        }
    }

    // Verificar contraseña
    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw new Error(`Error al verificar contraseña: ${error.message}`);
        }
    }

    // Obtener todos los usuarios (solo admin)
    static async findAll() {
        try {
            const text = 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC';
            const result = await query(text);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    // Actualizar usuario
    static async update(id, { username, email }) {
        try {
            const text = `
        UPDATE users 
        SET username = COALESCE($1, username), 
            email = COALESCE($2, email)
        WHERE id = $3
        RETURNING id, username, email, role, created_at
      `;
            const values = [username, email, id];
            const result = await query(text, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    // Eliminar usuario
    static async delete(id) {
        try {
            const text = 'DELETE FROM users WHERE id = $1 RETURNING id';
            const result = await query(text, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
}

export default User;