require('dotenv').config();
const knex = require('knex');

console.log('📍 database.js: création de la connexion knex...');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'abk_kandadji',
  },
  pool: { min: 2, max: 10 },
});

console.log('📍 database.js: db créé');

async function testConnection() {
  console.log('📍 testConnection: test en cours...');
  try {
    const result = await db.raw('SELECT NOW()');
    console.log('✅ Connexion PostgreSQL établie');
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   Host: ${process.env.DB_HOST}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion BD:', error.message);
    throw error;
  }
}

console.log('📍 database.js: export en cours...');

module.exports = {
  db,
  testConnection,
};

console.log('📍 database.js: chargé avec succès');