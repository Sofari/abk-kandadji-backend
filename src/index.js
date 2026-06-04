require('dotenv').config();
console.log('✅ dotenv chargé');

const express = require('express');
const cors = require('cors');
const { db, testConnection } = require('./config/database');

console.log('✅ modules chargés');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://tricky-hotels-post.loca.lt'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes de test
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API en ligne' });
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'ABK Kandadji API', version: '1.0.0' });
});

// ===== ENREGISTRER LES ROUTES =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/deadlines', require('./routes/deadlines'));
app.use('/api/alerts', require('./routes/alerts'));

// Démarrer le serveur
async function start() {
  try {
    console.log('📍 Test connexion BD...');
    await testConnection();
    
    const PORT = process.env.PORT || 3000;
    console.log(`📍 Démarrage serveur sur port ${PORT}...`);
    
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

start();