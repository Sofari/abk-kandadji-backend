# 🧪 GUIDE COMPLET : TEST DES API BACKEND

## 📋 Table des matières
1. [Tests rapides avec cURL](#tests-rapides-avec-curl)
2. [Tests avec Postman](#tests-avec-postman)
3. [Workflow authentification](#workflow-authentification)
4. [Exemples d'appels API](#exemples-dappels-api)
5. [Codes d'erreur](#codes-derreur)

---

## 🚀 Tests rapides avec cURL

### 1️⃣ Health Check

```bash
curl -i http://localhost:3000/health
```

**Réponse (200) :**
```json
{
  "success": true,
  "message": "API en ligne",
  "environment": "development",
  "timestamp": "2025-05-20T10:30:00.000Z"
}
```

### 2️⃣ Infos API

```bash
curl http://localhost:3000/api/info
```

---

## 🔐 Workflow d'Authentification

### Étape 1 : Login et obtenir un token

```bash
# POST /api/auth/login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dg@abk.ne",
    "password": "mot_de_passe"
  }'
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "dg@abk.ne",
      "nom_prenom": "Amadou Maïga",
      "role": "admin"
    }
  }
}
```

### Étape 2 : Utiliser le token

Sauvegarder le token dans une variable :

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Puis l'utiliser dans les requêtes :

```bash
curl http://localhost:3000/api/contracts \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📦 Exemples d'appels API

### GET : Lister les contrats

```bash
# Sans filtres
curl http://localhost:3000/api/contracts \
  -H "Authorization: Bearer $TOKEN"

# Avec pagination
curl "http://localhost:3000/api/contracts?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Avec filtres
curl "http://localhost:3000/api/contracts?statut=Actif&type=Accord%20de%20Financement&search=BM" \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "contracts": [
      {
        "id": 1,
        "numero_contrat": "BM-001-2023",
        "titre": "Accord de Financement - Banque Mondiale",
        "montant": 450.50,
        "devise": "XOF",
        "type_contrat": "Accord de Financement",
        "statut": "Actif",
        "created_at": "2025-05-20T10:00:00.000Z"
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 4,
      "pages": 1
    }
  }
}
```

### GET : Détail d'un contrat

```bash
curl http://localhost:3000/api/contracts/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "contract": {
      "id": 1,
      "numero_contrat": "BM-001-2023",
      "titre": "Accord de Financement - Banque Mondiale",
      "montant": 450.50,
      "date_signature": "2023-06-15",
      "date_fin_previsionnelle": "2028-06-30",
      ...
    },
    "parties": [
      {
        "id": 1,
        "nom_entite": "Agence du Barrage de Kandadji",
        "type_partie": "signataire",
        "email": "dg@abk.ne",
        ...
      }
    ],
    "documents": [
      {
        "id": 1,
        "nom_fichier": "BM-001-2023-Accord-Signe.pdf",
        "type_fichier": "contrat",
        "format": "pdf",
        "juridiquement_valide": true,
        ...
      }
    ],
    "deadlines": [
      {
        "id": 1,
        "description": "Inspection et rapport d'avancement",
        "date_action": "2025-06-01",
        "date_limite": "2025-07-01",
        "statut": "planifiee",
        ...
      }
    ],
    "clauses": [...],
    "avenants": [...]
  }
}
```

### POST : Créer un contrat

```bash
curl -X POST http://localhost:3000/api/contracts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "numero_contrat": "TEST-001-2025",
    "titre": "Contrat de Test",
    "type_id": 1,
    "statut_id": 1,
    "montant": 100.00,
    "devise": "XOF",
    "date_signature": "2025-05-20",
    "date_fin_previsionnelle": "2026-05-20",
    "departement_responsable": "Technique",
    "contact_principal": "Hassan Ali",
    "email_contact": "directeur.tech@abk.ne",
    "priorite": 3,
    "notes": "Contrat de test pour l'\''API"
  }'
```

**Réponse (201) :**
```json
{
  "success": true,
  "message": "Contrat créé avec succès",
  "data": {
    "contract": {
      "id": 5,
      "numero_contrat": "TEST-001-2025",
      "titre": "Contrat de Test",
      ...
    }
  }
}
```

### PUT : Mettre à jour un contrat

```bash
curl -X PUT http://localhost:3000/api/contracts/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "titre": "Titre Modifié",
    "montant": 500.00,
    "priorite": 5
  }'
```

**Réponse (200) :**
```json
{
  "success": true,
  "message": "Contrat mis à jour",
  "data": {
    "contract": {
      "id": 1,
      "titre": "Titre Modifié",
      "montant": 500.00,
      "priorite": 5,
      ...
    }
  }
}
```

### DELETE : Archiver un contrat

```bash
curl -X DELETE http://localhost:3000/api/contracts/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse (200) :**
```json
{
  "success": true,
  "message": "Contrat archivé"
}
```

---

## 📊 Tests avec Postman

### Importer la Collection

1. Ouvrir **Postman**
2. **File** → **Import**
3. Choisir le fichier `postman_collection.json`
4. Cliquer **Import**

### Configurer l'Environnement

1. **Environments** → **+ Create New**
2. Nom : `ABK Dev`
3. Ajouter les variables :
   - `baseUrl`: `http://localhost:3000`
   - `apiPath`: `/api`
   - `token`: `` (sera rempli après login)

### Workflow Postman

#### 1️⃣ Authentification
```
POST {{baseUrl}}/auth/login
Body:
{
  "email": "dg@abk.ne",
  "password": "password"
}
```

Après login, copier le token et l'ajouter à l'environnement.

#### 2️⃣ Lister les contrats
```
GET {{baseUrl}}{{apiPath}}/contracts
Authorization: Bearer {{token}}
```

#### 3️⃣ Créer un contrat
```
POST {{baseUrl}}{{apiPath}}/contracts
Authorization: Bearer {{token}}
Content-Type: application/json

Body: {...}
```

---

## 📋 Codes d'erreur

### 400 - Bad Request (Données invalides)

```json
{
  "success": false,
  "error": "Champs requis manquants",
  "code": "MISSING_FIELD",
  "validationErrors": [
    {
      "field": "numero_contrat",
      "message": "\"numero_contrat\" is required",
      "type": "any.required"
    }
  ]
}
```

### 401 - Unauthorized (Pas authentifié)

```json
{
  "success": false,
  "error": "Token manquant ou format invalide",
  "code": "NO_TOKEN"
}
```

Réponse si token expiré :
```json
{
  "success": false,
  "error": "Token expiré",
  "code": "TOKEN_EXPIRED",
  "expiredAt": "2025-05-20T10:00:00.000Z"
}
```

### 403 - Forbidden (Permissions insuffisantes)

```json
{
  "success": false,
  "error": "Accès refusé - permissions insuffisantes",
  "code": "INSUFFICIENT_PERMISSIONS",
  "requiredRoles": ["admin", "juriste"],
  "userRole": "consultant"
}
```

### 404 - Not Found (Ressource non trouvée)

```json
{
  "success": false,
  "error": "Contrat non trouvé",
  "code": "CONTRACT_NOT_FOUND"
}
```

### 409 - Conflict (Données en conflit)

```json
{
  "success": false,
  "error": "Ce numéro de contrat existe déjà",
  "code": "CONTRACT_NUMBER_EXISTS"
}
```

### 422 - Unprocessable Entity (Impossible à traiter)

```json
{
  "success": false,
  "error": "Référence invalide (clé étrangère)",
  "code": "INVALID_REFERENCE"
}
```

### 500 - Internal Server Error (Erreur serveur)

```json
{
  "success": false,
  "error": "Erreur lors de la récupération des contrats",
  "code": "DATABASE_ERROR",
  "details": {
    "originalError": "Connection refused",
    "stack": [...]
  }
}
```

---

## 🧬 Script de Test Automatisé

Créer un fichier `test-api.sh` :

```bash
#!/bin/bash

# Variables
BASE_URL="http://localhost:3000"
TOKEN=""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Test API ABK Kandadji ===${NC}\n"

# 1. Health Check
echo -e "${YELLOW}1. Health Check...${NC}"
curl -s $BASE_URL/health | jq .
echo ""

# 2. API Info
echo -e "${YELLOW}2. API Info...${NC}"
curl -s $BASE_URL/api/info | jq .
echo ""

# 3. Login
echo -e "${YELLOW}3. Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dg@abk.ne","password":"password"}')
echo "$LOGIN_RESPONSE" | jq .

# Extraire le token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
echo -e "${GREEN}Token obtenu: ${TOKEN:0:20}...${NC}\n"

# 4. Lister les contrats
echo -e "${YELLOW}4. Lister les contrats...${NC}"
curl -s $BASE_URL/api/contracts \
  -H "Authorization: Bearer $TOKEN" | jq '.data.pagination'
echo ""

# 5. Créer un contrat
echo -e "${YELLOW}5. Créer un contrat...${NC}"
curl -s -X POST $BASE_URL/api/contracts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "numero_contrat": "TEST-'$(date +%s)'",
    "titre": "Test Contract",
    "type_id": 1,
    "statut_id": 1,
    "montant": 100,
    "date_signature": "2025-05-20",
    "departement_responsable": "Test"
  }' | jq '.data.contract | {id, numero_contrat, titre}'

echo -e "\n${GREEN}✅ Tests terminés${NC}"
```

Exécuter :
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 📚 Ressources

- **Postman Collection** : `/docs/postman_collection.json`
- **API Swagger Docs** : `http://localhost:3000/api/docs` (à implémenter)
- **cURL Documentation** : https://curl.se/docs/
- **HTTP Status Codes** : https://httpwg.org/specs/rfc7231.html#status.codes

---

**Prêt à tester l'API ? 🧪**

Assurez-vous que :
1. ✅ PostgreSQL est en cours d'exécution
2. ✅ BD `abk_kandadji` existe avec les données
3. ✅ Serveur Node démarre sans erreur (`npm run dev`)
4. ✅ `/health` répond 200 OK
