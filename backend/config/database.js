import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración del pool de conexiones
const pool = new Pool({
    user: process.env.DB_USERNAME || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    max: 10, // Conexiones máximas
    idleTimeoutMillis: 30000, // Tiempo de inactividad máximo de una conexión
});

// Función para probar la conexión
export const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Conexión exitosa a PostgreSQL');

        const result = await client.query('SELECT NOW()');
        console.log('Hora del servidor:', result.rows[0].now);

        client.release();
        return true;
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:', error.message);
        return false;
    }
};

// Función para ejecutar queries con manejo de errores
export const query = async (text, params) => {
    try {
        const start = Date.now();
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        console.log('Query ejecutada:', { text, duration, rows: result.rowCount });
        return result;
    } catch (error) {
        console.error('Error en query:', error.message);
        throw error;
    }
};

export default pool;