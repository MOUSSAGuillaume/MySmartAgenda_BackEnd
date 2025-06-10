# 🗓️ MySmartAgenda - Back-end

Projet de gestion d'agenda, rendez-vous et tâches en **Node.js** avec **PostgreSQL**, développé en **POO**, prêt pour une intégration front ou mobile.

## 🚀 Fonctionnalités

### Utilisateurs
- Création de compte avec hash de mot de passe (bcrypt)
- Connexion sécurisée avec JWT
- Authentification middleware (`Authorization: Bearer TOKEN`)

### Rendez-vous
- CRUD de rendez-vous
- Récupération par utilisateur
- Filtrage par **mois / année** pour le calendrier

### Tâches (To-Do)
- Création et affichage de tâches
- Statut : `pending`, `done`, `urgent`
- Récupération des tâches urgentes sans date
- Récupération par mois/année
- Marquage terminé
- Modification partielle (PATCH)

## 🛠️ Stack
- **Node.js**
- **Express**
- **PostgreSQL**
- **pg** (driver PostgreSQL)
- **bcrypt**
- **jsonwebtoken**


## 📁 Structure
/models ← logique métier (User, Todo, Rendezvous)
/controllers ← gestion des routes
/routes ← fichiers Express pour les endpoints
/db.js ← connexion à PostgreSQL
/server.js ← point d’entrée de l’app


## ▶️ Lancer le projet en local

```bash
npm install
node server.js
🔐 Créez un fichier .env si vous utilisez des variables d’environnement (optionnel).

🧪 Test API avec Postman
Authentifiez-vous avec /users/login pour recevoir un token, puis testez les routes protégées en ajoutant :


Header → Authorization: Bearer VOTRE_TOKEN
☁️ Déploiement prévu sur AlwaysData
Base PostgreSQL hébergée chez AlwaysData

API REST exposée publiquement

📌 Auteur
Guillaume Moussa – Démo full backend pour projet.