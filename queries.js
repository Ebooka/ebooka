const { Pool } = require('pg');
const config = require('config');
const connectionString = config.get('postgresURI');

console.log('process env', process.env.DB_URL);

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: process.env.NODE_ENV === 'production',
});

test();

async function test() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM users');
        console.log(res.rows);
    } catch (err) {
        console.log(err.stack);
    } finally {
        client.release();
    }
}

module.exports = { pool }