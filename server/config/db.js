import 'dotenv/config';

let query;

console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

// If DATABASE_URL exists → always use remote DB
if (process.env.DATABASE_URL) {
    // postgres.js (Supabase, Neon, etc)
    const postgres = (await import('postgres')).default;

    const sql = postgres(process.env.DATABASE_URL, {
        ssl: 'require',
        max: 1,              // correct for serverless
        idle_timeout: 20,
    });

    query = async (text, params = []) => {
        const rows = await sql.unsafe(text, params);
        return { rows };
    };
} else {
    // Local development ONLY
    const pg = (await import('pg')).default;
    const { Pool } = pg;

    const pool = new Pool({
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
    });

    query = (text, params = []) => pool.query(text, params);
}

export { query };