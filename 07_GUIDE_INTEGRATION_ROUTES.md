# 🔗 GUIDE D'INTÉGRATION : Ajouter les routes au serveur

## 📋 Résumé des fichiers créés

```
✅ src/controllers/deadlineController.js    - Gestion échéances
✅ src/routes/deadlines.js                 - Routes échéances
✅ src/controllers/alertController.js       - Gestion alertes
✅ src/routes/alerts.js                    - Routes alertes
✅ src/controllers/authController.js        - Authentification
✅ src/routes/auth.js                      - Routes auth
```

---

## 🚀 ÉTAPE 1 : Copier les fichiers

1. Téléchargez tous les fichiers depuis les outputs
2. Placez-les dans les bons dossiers :

```
src/
├── controllers/
│   ├── contractController.js       (déjà existant)
│   ├── deadlineController.js       ← Nouveau
│   ├── alertController.js          ← Nouveau
│   └── authController.js           ← Nouveau
│
└── routes/
    ├── contracts.js                (déjà existant)
    ├── deadlines.js                ← Nouveau
    ├── alerts.js                   ← Nouveau
    └── auth.js                     ← Nouveau
```

---

## 🔧 ÉTAPE 2 : Enregistrer les routes dans `src/index.js`

Ouvrez `src/index.js` et **remplacez cette section** (vers la ligne 90) :

### AVANT :
```javascript
// Importer les routes (seront créées dans la prochaine étape)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/contracts', require('./routes/contracts'));
// app.use('/api/deadlines', require('./routes/deadlines'));
// app.use('/api/alerts', require('./routes/alerts'));
// app.use('/api/users', require('./routes/users'));

// ===== PLACEHOLDER ROUTES (pour test immédiat) =====

app.get('/api/contracts', (req, res) => {
  res.json({
    success: true,
    message: 'Route contrats non implémentée (à venir)',
    hint: 'Cette route sera implémentée à la Phase 2b',
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: "Endpoint d'authentification (à venir)",
    hint: "Implémentez le contrôleur d'authentification dans authController.js",
  });
});
```

### APRÈS :
```javascript
// ===== IMPORTER LES ROUTES =====

app.use('/api/auth', require('./routes/auth'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/deadlines', require('./routes/deadlines'));
app.use('/api/alerts', require('./routes/alerts'));
```

---

## ✅ ÉTAPE 3 : Tester

Redémarrez le serveur :

```cmd
npm run dev
```

Vous devriez voir :

```
✅ Serveur démarré sur http://localhost:3000
```

Testez les nouveaux endpoints :

```cmd
# 1. Login (obtenir un token)
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"dg@abk.ne\",\"password\":\"motdepasse\"}"

# 2. Lister les échéances (remplacez TOKEN par le token obtenu)
curl http://localhost:3000/api/deadlines ^
  -H "Authorization: Bearer TOKEN"

# 3. Lister les alertes
curl http://localhost:3000/api/alerts ^
  -H "Authorization: Bearer TOKEN"
```

---

## 📚 Endpoints disponibles

### Authentification
```
POST   /api/auth/login              - Connexion
POST   /api/auth/refresh            - Rafraîchir token
GET    /api/auth/profile            - Profil utilisateur
POST   /api/auth/logout             - Déconnexion
```

### Contrats (existant)
```
GET    /api/contracts               - Lister
POST   /api/contracts               - Créer
GET    /api/contracts/:id           - Détail
PUT    /api/contracts/:id           - Modifier
DELETE /api/contracts/:id           - Supprimer
```

### Échéances ⭐ (Nouveau)
```
GET    /api/deadlines               - Lister
GET    /api/deadlines/urgent        - Urgentes (60j)
GET    /api/deadlines/:id           - Détail
POST   /api/deadlines               - Créer
PUT    /api/deadlines/:id           - Modifier
PUT    /api/deadlines/:id/complete  - Marquer complétée
DELETE /api/deadlines/:id           - Supprimer
```

### Alertes ⭐ (Nouveau)
```
GET    /api/alerts                  - Lister
GET    /api/alerts/:id/history      - Historique envoi
POST   /api/alerts                  - Créer
PUT    /api/alerts/:id              - Modifier
PUT    /api/alerts/:id/toggle       - Activer/Désactiver
POST   /api/alerts/:id/test         - Test d'envoi
DELETE /api/alerts/:id              - Supprimer
```

---

## 🔐 Authentification requise

**Tous les endpoints (sauf `/api/auth/login`)** nécessitent un token JWT :

```bash
# Ajouter ce header à chaque requête
Authorization: Bearer <token-obtenu-au-login>
```

---

## 👥 Rôles et permissions

| Endpoint | Rôles autorisés |
|----------|-----------------|
| POST /deadlines | admin, juriste |
| PUT /deadlines/:id | admin, juriste, consultant |
| DELETE /deadlines/:id | admin |
| POST /alerts | admin, juriste |
| PUT /alerts | admin, juriste |
| DELETE /alerts | admin |

---

## 🎯 Utilisateurs de test (depuis la seed data)

```
Email: dg@abk.ne
Mot de passe: (vous devez définir un mot de passe en BD)

OU

Email: juriste.contrats@abk.ne
Email: directeur.tech@abk.ne
Email: documentaliste@abk.ne
```

⚠️ **Note** : Les mots de passe ne sont pas définis dans la seed data actuelle.
Vous devez les ajouter manuellement ou les hacher avec bcryptjs.

---

## 🚨 Problème de mot de passe ?

Si le login échoue avec "Email ou mot de passe incorrect", c'est probablement que les mots de passe ne sont pas hashés.

**Solution rapide (pour développement) :**

```sql
-- Hashé avec bcryptjs (coût 10)
-- Password: "password"
UPDATE users SET password_hash = '$2b$10$...' WHERE email = 'dg@abk.ne';
```

Ou utilisez cet outil en ligne : https://bcrypt-generator.com/

---

## ✨ Prochaines étapes

Une fois les routes intégrées et testées :

1. **Ajouter userController** pour la gestion des utilisateurs
2. **Implémenter Nodemailer** pour les vrais envois d'email
3. **Créer le frontend React** (Phase 3)
4. **Mettre en place Bull + Redis** pour les jobs d'alertes (Phase 4)

---

## 📝 Checklist d'intégration

- [ ] Fichiers copiés dans les bons dossiers
- [ ] Routes enregistrées dans index.js
- [ ] Serveur redémarré sans erreur
- [ ] `/api/auth/login` fonctionne
- [ ] `/api/deadlines` retourne les données
- [ ] `/api/alerts` retourne les données
- [ ] Les tokens JWT sont acceptés
- [ ] Les permissions fonctionnent (admin vs consultant)

---

**Une fois tout intégré et testé, vous êtes prêt pour le FRONTEND REACT ! 🎨**
