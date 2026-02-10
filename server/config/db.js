import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

let query;

if (isProd && process.env.DATABASE_URL) {
    // Supabase / postgres.js (prod)
    const postgres = (await import('postgres')).default;

    const sql = postgres(process.env.DATABASE_URL, {
        ssl: 'require',
        max: 1,              // IMPORTANT for serverless
        idle_timeout: 20,
    });

    query = async (text, params = []) => {
        const rows = await sql.unsafe(text, params);
        return { rows };
    };
} else {
    // Local pg (dev)
    const pg = (await import('pg')).default;
    const { Pool } = pg;

    const pool = new Pool({
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT),
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
    });

    query = (text, params = []) => pool.query(text, params);
}

export { query };