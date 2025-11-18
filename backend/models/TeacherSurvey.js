import { query } from '../config/database.js';

class TeacherSurvey {
    // Crear nueva encuesta de profesor
    static async create(surveyData) {
        try {
            const text = `
        INSERT INTO teacher_surveys (
          user_id, has_used_chatbot, chatbots_used, courses_used,
          purposes, outcomes, challenges, likelihood_future_use,
          advantages, concerns, resources_needed, age_range,
          institution_type, country, years_experience, additional_comments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `;

            const values = [
                surveyData.user_id,
                surveyData.has_used_chatbot,
                surveyData.chatbots_used,
                surveyData.courses_used,
                surveyData.purposes,
                surveyData.outcomes,
                surveyData.challenges,
                surveyData.likelihood_future_use,
                surveyData.advantages,
                surveyData.concerns,
                surveyData.resources_needed,
                surveyData.age_range,
                surveyData.institution_type,
                surveyData.country,
                surveyData.years_experience,
                surveyData.additional_comments
            ];

            const result = await query(text, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al crear encuesta de profesor: ${error.message}`);
        }
    }

    // Obtener todas las encuestas
    static async findAll() {
        try {
            const text = `
        SELECT t.*, u.username, u.email 
        FROM teacher_surveys t
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
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
        SELECT t.*, u.username, u.email 
        FROM teacher_surveys t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = $1
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
            const text = 'SELECT * FROM teacher_surveys WHERE user_id = $1 ORDER BY created_at DESC';
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
        UPDATE teacher_surveys 
        SET 
          has_used_chatbot = COALESCE($1, has_used_chatbot),
          chatbots_used = COALESCE($2, chatbots_used),
          courses_used = COALESCE($3, courses_used),
          purposes = COALESCE($4, purposes),
          outcomes = COALESCE($5, outcomes),
          challenges = COALESCE($6, challenges),
          likelihood_future_use = COALESCE($7, likelihood_future_use),
          advantages = COALESCE($8, advantages),
          concerns = COALESCE($9, concerns),
          resources_needed = COALESCE($10, resources_needed),
          age_range = COALESCE($11, age_range),
          institution_type = COALESCE($12, institution_type),
          country = COALESCE($13, country),
          years_experience = COALESCE($14, years_experience),
          additional_comments = COALESCE($15, additional_comments)
        WHERE id = $16
        RETURNING *
      `;

            const values = [
                surveyData.has_used_chatbot,
                surveyData.chatbots_used,
                surveyData.courses_used,
                surveyData.purposes,
                surveyData.outcomes,
                surveyData.challenges,
                surveyData.likelihood_future_use,
                surveyData.advantages,
                surveyData.concerns,
                surveyData.resources_needed,
                surveyData.age_range,
                surveyData.institution_type,
                surveyData.country,
                surveyData.years_experience,
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
            const text = 'DELETE FROM teacher_surveys WHERE id = $1 RETURNING id';
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
          COUNT(CASE WHEN has_used_chatbot = true THEN 1 END) as teachers_using_chatbots,
          COUNT(CASE WHEN likelihood_future_use = 'Very likely' THEN 1 END) as very_likely_continue,
          COUNT(CASE WHEN likelihood_future_use = 'Likely' THEN 1 END) as likely_continue
        FROM teacher_surveys
      `;
            const result = await query(text);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}

export default TeacherSurvey;