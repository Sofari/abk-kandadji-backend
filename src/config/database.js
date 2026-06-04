require('dotenv').config();
const knex = require('knex');

console.log('📍 database.js: création de la connexion knex...');

// Utiliser DATABASE_URL si disponible (production Neon/Render)
const connection = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'abk_kandadji',
    };

const db = knex({
  client: 'pg',
  connection: connection,
  pool: { min: 2, max: 10 },
  ssl: process.env.NODE_ENV === 'production' ? true : false
});

console.log('📍 database.js: db créé');

async function testConnection() {
  console.log('📍 testConnection: test en cours...');
  try {
    const result = await db.raw('SELECT NOW()');
    console.log('✅ Connexion PostgreSQL établie');
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion BD:', error.message);
    throw error;
  }
}

module.exports = {
  db,
  testConnection,
};