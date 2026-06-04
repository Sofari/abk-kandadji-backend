/**
 * =====================================================
 * Configuration des Variables d'Environnement
 * =====================================================
 * 
 * Ce fichier centralise toutes les variables d'env,
 * les valide et les rend disponibles dans toute l'application
 * 
 * Utilisation :
 * const config = require('./config/env');
 * console.log(config.API_PORT); // 3000
 */

require('dotenv').config();

// =====================================================
// Validation et Centralisation
// =====================================================

const config = {
  // ===== SERVEUR =====
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_PORT: parseInt(process.env.PORT, 10) || 3000,
  API_HOST: process.env.API_HOST || 'localhost',
  
  // ===== DATABASE =====
  DATABASE: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT, 10) || 5432,
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'abk_kandadji',
    URL: process.env.DATABASE_URL,
  },
  
  // ===== AUTHENTIFICATION =====
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRY: process.env.JWT_EXPIRY || '24h',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
  
  // ===== REDIS (Queues) =====
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
    PASSWORD: process.env.REDIS_PASSWORD || '',
    DB: parseInt(process.env.REDIS_DB, 10) || 0,
  },
  
  // ===== EMAIL =====
  EMAIL: {
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'noreply@abk-kandadji.ne',
    FROM_NAME: process.env.SMTP_FROM_NAME || 'ABK Kandadji',
  },
  
  // ===== SMS (Twilio) =====
  TWILIO: {
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    ENABLED: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN,
  },
  
  // ===== MINIO (Stockage Fichiers) =====
  MINIO: {
    ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost:9000',
    ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minioadmin',
    BUCKET: process.env.MINIO_BUCKET || 'abk-kandadji',
    USE_SSL: process.env.MINIO_USE_SSL === 'true',
  },
  
  // ===== CORS =====
  CORS_ORIGIN: (process.env.CORS_ORIGIN || 'http://localhost:3001').split(','),
  
  // ===== RATE LIMITING =====
  RATE_LIMIT: {
    WINDOW_MS: (parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15) * 60 * 1000,
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
  
  // ===== FEATURES FLAGS =====
  FEATURES: {
    SMS_ALERTS: process.env.FEATURE_SMS_ALERTS === 'true',
    ADVANCED_SEARCH: process.env.FEATURE_ADVANCED_SEARCH === 'true',
    EXPORT_EXCEL: process.env.FEATURE_EXPORT_EXCEL === 'true',
  },
  
  // ===== LOGS =====
  LOGS: {
    LEVEL: process.env.LOG_LEVEL || 'info',
    DIR: process.env.LOG_DIR || './logs',
    MAX_SIZE: process.env.LOG_MAX_SIZE || '10m',
    MAX_FILES: process.env.LOG_MAX_FILES || '14d',
  },
};

// =====================================================
// Validation des Variables Critiques
// =====================================================

function validateConfig() {
  const errors = [];
  
  // JWT Secret (production)
  if (config.NODE_ENV === 'production') {
    if (!config.JWT.SECRET || config.JWT.SECRET.length < 32) {
      errors.push('❌ JWT_SECRET manquant ou trop court (min 32 chars) en production');
    }
    if (!config.JWT.REFRESH_SECRET || config.JWT.REFRESH_SECRET.length < 32) {
      errors.push('❌ JWT_REFRESH_SECRET manquant ou trop court (min 32 chars) en production');
    }
  }
  
  // Email (optionnel mais recommandé)
  if (!config.EMAIL.SMTP_USER || !config.EMAIL.SMTP_PASSWORD) {
    console.warn('⚠️  Email SMTP non configuré - les alertes par email ne fonctionneront pas');
  }
  
  // Database
  if (!config.DATABASE.URL && (!config.DATABASE.HOST || !config.DATABASE.NAME)) {
    errors.push('❌ Configuration database invalide (DATABASE_URL ou DB_HOST + DB_NAME requis)');
  }
  
  if (errors.length > 0) {
    errors.forEach(err => console.error(err));
    process.exit(1);
  }
  
  return true;
}

// Valider au chargement
validateConfig();

// =====================================================
// Utilitaires
// =====================================================

/**
 * Vérifier si on est en mode développement
 */
config.isDevelopment = config.NODE_ENV === 'development';

/**
 * Vérifier si on est en mode production
 */
config.isProduction = config.NODE_ENV === 'production';

/**
 * Vérifier si on est en mode test
 */
config.isTest = config.NODE_ENV === 'test';

// =====================================================
// Export
// =====================================================

module.exports = config;
