import { query } from '../config/database.js';

class StudentSurvey {
    // Crear nueva encuesta de estudiante
    static async create(surveyData) {
        try {
            const text = `
        INSERT INTO student_surveys (
          user_id, has_used_chatbot, chatbots_used, usage_frequency,
          usefulness_rating, tasks_used_for, overall_experience,
          preferred_chatbot, effectiveness_comparison,
          will_continue_using, would_recommend, additional_comments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;

            const values = [
                surveyData.user_id,
                surveyData.has_used_chatbot,
                surveyData.chatbots_used,
                surveyData.usage_frequency,
                surveyData.usefulness_rating,
                surveyData.tasks_used_for,
                surveyData.overall_experience,
                surveyData.preferred_chatbot,
                surveyData.effectiveness_comparison,
                surveyData.will_continue_using,
                surveyData.would_recommend,
                surveyData.additional_comments
            ];

            const result = await query(text, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al crear encuesta de estudiante: ${error.message}`);
        }
    }

    // Obtener todas las encuestas
    static async findAll() {
        try {
            const text = `
        SELECT s.*, u.username, u.email 
        FROM student_surveys s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.created_at DESC
      `;
            const result = await query(text);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener encuestas: ${error.message}`);
        }
    }

    // Obtener encuesta por ID
    static async findById(id) {
        try {
            const text = `
        SELECT s.*, u.username, u.email 
        FROM student_surveys s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = $1
      `;
            const result = await query(text, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al obtener encuesta: ${error.message}`);
        }
    }

    // Obtener encuestas por usuario
    static async findByUserId(userId) {
        try {
            const text = 'SELECT * FROM student_surveys WHERE user_id = $1 ORDER BY created_at DESC';
            const result = await query(text, [userId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener encuestas del usuario: ${error.message}`);
        }
    }

    // Actualizar encuesta
    static async update(id, surveyData) {
        try {
            const text = `
        UPDATE student_surveys 
        SET 
          has_used_chatbot = COALESCE($1, has_used_chatbot),
          chatbots_used = COALESCE($2, chatbots_used),
          usage_frequency = COALESCE($3, usage_frequency),
          usefulness_rating = COALESCE($4, usefulness_rating),
          tasks_used_for = COALESCE($5, tasks_used_for),
          overall_experience = COALESCE($6, overall_experience),
          preferred_chatbot = COALESCE($7, preferred_chatbot),
          effectiveness_comparison = COALESCE($8, effectiveness_comparison),
          will_continue_using = COALESCE($9, will_continue_using),
          would_recommend = COALESCE($10, would_recommend),
          additional_comments = COALESCE($11, additional_comments)
        WHERE id = $12
        RETURNING *
      `;

            const values = [
                surveyData.has_used_chatbot,
                surveyData.chatbots_used,
                surveyData.usage_frequency,
                surveyData.usefulness_rating,
                surveyData.tasks_used_for,
                surveyData.overall_experience,
                surveyData.preferred_chatbot,
                surveyData.effectiveness_comparison,
                surveyData.will_continue_using,
                surveyData.would_recommend,
                surveyData.additional_comments,
                id
            ];

            const result = await query(text, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al actualizar encuesta: ${error.message}`);
        }
    }

    // Eliminar encuesta
    static async delete(id) {
        try {
            const text = 'DELETE FROM student_surveys WHERE id = $1 RETURNING id';
            const result = await query(text, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al eliminar encuesta: ${error.message}`);
        }
    }

    // Obtener estadísticas
    static async getStatistics() {
        try {
            const text = `
        SELECT 
          COUNT(*) as total_surveys,
          AVG(usefulness_rating) as avg_usefulness,
          AVG(overall_experience) as avg_experience,
          COUNT(CASE WHEN has_used_chatbot = true THEN 1 END) as users_with_chatbot,
          COUNT(CASE WHEN will_continue_using = true THEN 1 END) as will_continue
        FROM student_surveys
      `;
            const result = await query(text);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}

export default StudentSurvey;