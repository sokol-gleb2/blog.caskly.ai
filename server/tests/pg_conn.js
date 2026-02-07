import { getClient } from '../config/db.js';

export const runDbConnTest = async () => {
  let client;
  try {
    client = await getClient();
    const result = await client.query('SELECT 1 AS ok');
    if (!result.rows.length || result.rows[0].ok !== 1) {
      throw new Error('Unexpected response from database');
    }
    console.log('Database connection OK');
    process.exit(0);
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  } finally {
    if (client) client.release();
  }
}
