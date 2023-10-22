const { Pool } = require('pg');
const config = require('config');
const connectionString = config.get('postgresURI');

console.log('process env', process.env.DB_URL);

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: process.env.NODE_ENV === 'production',
});

module.exports = { pool }