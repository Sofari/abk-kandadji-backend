# 🚀 GUIDE COMPLET : BACKEND NODE.JS/EXPRESS

## 📋 Table des matières
1. [Installation et setup](#installation-et-setup)
2. [Structure des fichiers](#structure-des-fichiers)
3. [Configuration](#configuration)
4. [Démarrage du serveur](#démarrage-du-serveur)
5. [Test des endpoints](#test-des-endpoints)
6. [Prochaines étapes](#prochaines-étapes)

---

## ⚙️ Installation et Setup

### Prérequis
- ✅ Node.js 16+ installé
- ✅ npm 8+ installé
- ✅ PostgreSQL 12+ avec la BD `abk_kandadji` créée (Phase 1)
- ✅ Git (optionnel)

### Vérifier Node.js
```bash
node --version   # v16.x ou supérieur
npm --version    # v8.x ou supérieur
```

### 1️⃣ Créer la structure du projet

```bash
# Créer le répertoire du projet
mkdir abk-kandadji-backend
cd abk-kandadji-backend

# Initialiser npm (créer package.json)
npm init -y
```

### 2️⃣ Installer les dépendances

Copier le `package.json` fourni, puis :

```bash
npm install
```

**Dépendances principales installées :**
- ✅ express (serveur web)
- ✅ pg + knex (PostgreSQL)
- ✅ jsonwebtoken + bcryptjs (authentification)
- ✅ cors + helmet (sécurité)
- ✅ nodemailer (emails)
- ✅ bull + redis (queues)
- ✅ pino (logs)

### 3️⃣ Créer la structure des répertoires

```bash
mkdir -p src/{config,middleware,routes,controllers,models,services,utils,jobs}
mkdir -p migrations seeds tests/{unit,integration} logs docs
```

### 4️⃣ Créer le fichier .env

```bash
# Copier le template
cp .env.example .env

# Éditer le fichier
nano .env  # ou votre éditeur préféré
```

**Valeurs minimales pour développement :**
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=abk_kandadji
JWT_SECRET=dev-secret-key-at-least-32-characters-long-xxxxxxxxxxxxxxxx
JWT_REFRESH_SECRET=dev-refresh-secret-at-least-32-characters-long-xxxxxx
BCRYPT_ROUNDS=10
REDIS_HOST=localhost
REDIS_PORT=6379
SMTP_HOST=smtp.gmail.com
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-app-password
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
```

### 5️⃣ Copier les fichiers créés

Copier dans le projet :
```
src/
  ├── config/
  │   ├── database.js       (fichier fourni)
  │   └── env.js            (fichier fourni)
  ├── middleware/
  │   ├── auth.js           (fichier fourni)
  │   └── errorHandler.js   (fichier fourni)
  ├── utils/
  │   └── logger.js         (fichier fourni)
  └── index.js              (fichier fourni)
```

---

## 🗂️ Structure des fichiers

```
abk-kandadji-backend/
├── .env                          ← Variables d'env (local)
├── .env.example                  ← Template (git)
├── .gitignore
├── package.json
├── package-lock.json
│
├── src/
│   ├── index.js                  ← Point d'entrée
│   │
│   ├── config/
│   │   ├── database.js           ← Knex + Pool
│   │   └── env.js                ← Variables d'env
│   │
│   ├── middleware/
│   │   ├── auth.js               ← JWT + RBAC
│   │   ├── errorHandler.js       ← Gestion erreurs
│   │   └── validation.js         ← Validation (à créer)
│   │
│   ├── routes/                   ← À créer
│   │   ├── index.js
│   │   ├── contracts.js
│   │   ├── deadlines.js
│   │   ├── alerts.js
│   │   ├── users.js
│   │   └── auth.js
│   │
│   ├── controllers/              ← À créer
│   │   ├── contractController.js
│   │   ├── deadlineController.js
│   │   ├── alertController.js
│   │   ├── authController.js
│   │   └── userController.js
│   │
│   ├── models/                   ← À créer
│   │   ├── Contract.js
│   │   ├── Deadline.js
│   │   ├── Alert.js
│   │   └── AuditLog.js
│   │
│   ├── services/                 ← À créer
│   │   ├── contractService.js
│   │   ├── deadlineService.js
│   │   ├── alertService.js
│   │   └── authService.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── validators.js         ← À créer
│   │   └── responseFormatter.js  ← À créer
│   │
│   └── jobs/
│       └── alertScheduler.js     ← À créer
│
├── migrations/                   ← Migrations Knex (optionnel)
├── seeds/                        ← Seeders (optionnel)
├── tests/
│   ├── unit/
│   └── integration/
├── logs/                         ← Logs générés
├── docs/
│   ├── postman.json
│   └── api-spec.md
└── README.md
```

---

## ⚙️ Configuration

### Hiérarchie de configuration

```
.env
  ↓ (chargé par dotenv)
src/config/env.js
  ↓ (validé et centralisé)
src/**/*.js
  ↓ (utilisé partout)
const config = require('./config/env');
config.API_PORT  // 3000
config.DATABASE.NAME  // abk_kandadji
```

### Vérifier la configuration

```bash
# Test rapide
node -e "const config = require('./src/config/env'); console.log(config);"
```

---

## 🚀 Démarrage du serveur

### Option 1 : Démarrage simple

```bash
node src/index.js
```

**Sortie attendue :**
```
╔════════════════════════════════════════════════════════════╗
║         🚀 ABK KANDADJI API REST - Démarrage...          ║
╚════════════════════════════════════════════════════════════╝

📍 Étape 1 : Test de connexion PostgreSQL...
✅ Connexion PostgreSQL établie
   Database: abk_kandadji
   Host: localhost

📍 Étape 2 : Démarrage du serveur Express...
✅ Serveur démarré sur http://localhost:3000

📊 Configuration Active :
   Environment: development
   Database: abk_kandadji@localhost:5432
   Log Level: debug
   CORS Origins: http://localhost:3001, http://localhost:3000

🔗 Endpoints disponibles :
   GET  /health
   GET  /api/info
   POST /api/auth/login
   GET  /api/contracts
```

### Option 2 : Développement avec nodemon (auto-reload)

```bash
npm run dev
```

(Nécessite `nodemon` - déjà dans package.json)

### Option 3 : Mode production

```bash
NODE_ENV=production npm start
```

---

## 🧪 Test des endpoints

### 1️⃣ Vérifier le serveur (Health Check)

```bash
curl http://localhost:3000/health

# Réponse :
{
  "success": true,
  "message": "API en ligne",
  "environment": "development",
  "timestamp": "2025-05-20T10:30:00.000Z"
}
```

### 2️⃣ Infos sur l'API

```bash
curl http://localhost:3000/api/info

# Réponse :
{
  "name": "ABK Kandadji - API REST",
  "version": "1.0.0",
  "documentation": "https://docs.abk-kandadji.ne",
  "endpoints": {
    "auth": "/api/auth",
    "contracts": "/api/contracts",
    "deadlines": "/api/deadlines",
    "alerts": "/api/alerts",
    "users": "/api/users"
  }
}
```

### 3️⃣ Test avec Postman

1. Ouvrir **Postman**
2. Créer une nouvelle requête
3. GET `http://localhost:3000/health`
4. Cliquer **Send**

### 4️⃣ Test de la connexion BD

```bash
# Via psql
psql -U postgres -d abk_kandadji -c "SELECT COUNT(*) FROM contracts;"

# Devrait retourner : 4 contrats
```

---

## 📊 Logs et Monitoring

### Consulter les logs

```bash
# Logs en temps réel
tail -f logs/app.log

# Erreurs uniquement
tail -f logs/error.log

# Avec grep
grep "ERROR" logs/error.log
grep "CONTRACT" logs/app.log
```

### Niveaux de logs

```
FATAL  - Erreurs critiques (arrêt du serveur)
ERROR  - Erreurs (ex: BD indisponible)
WARN   - Avertissements (ex: auth échoué)
INFO   - Informations (ex: démarrage, requêtes HTTP)
DEBUG  - Détails (logs structurés)
TRACE  - Très détaillé
```

Changer le niveau : `.env` → `LOG_LEVEL=debug`

---

## 🔗 Intégration Frontend

### CORS

Le serveur accepte les requêtes de :
- `http://localhost:3001` (Frontend par défaut)
- `http://localhost:3000` (Test local)

À modifier dans `.env` :
```env
CORS_ORIGIN=http://localhost:3001,http://localhost:3000,https://votre-domaine.ne
```

### Exemple de requête depuis React

```javascript
// frontend/src/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter le token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

## 🐛 Dépannage

### Erreur : "Port 3000 déjà utilisé"

```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou changer le port
PORT=3001 npm run dev
```

### Erreur : "Connexion BD échouée"

```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Démarrer PostgreSQL
sudo systemctl start postgresql

# Vérifier les credentials dans .env
psql -U postgres -h localhost
```

### Erreur : "Module not found"

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "JWT_SECRET manquant"

```bash
# Vérifier .env
grep JWT_SECRET .env

# Ajouter si manquant
echo "JWT_SECRET=dev-secret-key-min-32-chars-xxxxxxxxxxxxxxxxxx" >> .env
```

---

## 📈 Prochaines étapes

### Phase 2b : Contrôleurs et Routes
- ✅ Créer `contractController.js`
- ✅ Créer `contractModel.js`
- ✅ Créer `contractService.js`
- ✅ Créer `routes/contracts.js`
- ✅ Tester les endpoints

### Phase 2c : Authentification
- ✅ Implémenter l'authentification JWT
- ✅ Créer l'endpoint `/api/auth/login`
- ✅ Créer l'endpoint `/api/auth/register`
- ✅ Protéger les routes avec `authenticate` middleware

### Phase 2d : Services Métier
- ✅ Logique de calcul des alertes
- ✅ Logique de validation des conditions
- ✅ Service de pénalités

### Phase 3 : Frontend React
- Créer le projet React
- Intégrer avec cette API
- Créer l'interface utilisateur

---

## 📚 Ressources

- [Express.js Documentation](https://expressjs.com/)
- [Knex.js Query Builder](http://knexjs.org/)
- [JWT (jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)
- [Pino Logger](https://getpino.io/)

---

**Êtes-vous prêt pour la Phase 2b : Créer les contrôleurs et routes ? 🚀**
