const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-service',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'app_password',
  database: process.env.DB_NAME || 'app_db',
  max: 10,
  idleTimeoutMillis: 10000
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dados (
      id SERIAL PRIMARY KEY,
      valor TEXT NOT NULL,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function checkConnection() {
  await pool.query('SELECT 1');
}

module.exports = {
  pool,
  initDb,
  checkConnection
};
