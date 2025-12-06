const knex = require('knex');
const config = require('../../config');

const db = knex({
  client: 'mysql2',
  connection: {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    charset: 'utf8mb4',
  },
  pool: {
    min: 2,
    max: 10,
  },
});

const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('[OK] Database connected successfully');
    return true;
  } catch (error) {
    console.error('[ERROR] Database connection failed:', error.message);
    return false;
  }
};

module.exports = { db, testConnection };
