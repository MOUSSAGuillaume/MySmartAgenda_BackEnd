# 🗓️ MySmartAgenda – Back-end

API REST Node.js / Express pour la gestion intelligente d'agenda, de rendez-vous et de tâches, connectée à PostgreSQL.  
**Projet 100% POO, sécurisé (JWT + bcrypt), prêt à brancher sur un front web ou mobile.**

> 🔗 Déployée ici : [https://mysmartagenda.alwaysdata.net](https://mysmartagenda.alwaysdata.net)

---

## 🚀 Fonctionnalités principales

- **Gestion des utilisateurs** : inscription sécurisée (hash bcrypt), connexion JWT, récupération des utilisateurs.
- **Gestion des rendez-vous** : création, lecture (par utilisateur, par mois/année), synchronisation avec le calendrier.
- **Gestion des tâches (To-Do)** : ajout, lecture, statut (`pending`, `done`, `urgent`), récupération par mois/année, modification, marquage terminé, tâches urgentes synchronisées avec l’agenda.

---

## 🛠️ Stack technique

- **Node.js**, **Express**
- **PostgreSQL** (AlwaysData en prod)
- **pg** (driver PostgreSQL)
- **bcrypt** (hash de mot de passe)
- **jsonwebtoken** (auth JWT)
- **dotenv** (variables d'environnement)

---

## 📦 Structure des dossiers

/models ← Modèles (User, Rendezvous, Todo)
user.js
rendezvous.js
todo.js

/controllers ← Logique métier (contrôleurs d’API)
/routes ← Définition des endpoints Express
/db.js ← Connexion PostgreSQL
/middlewares ← Middleware (auth JWT)
/.env ← Variables d'environnement (local)
/server.js ← Entrée principale Express
---
## ⚙️ Variables d’environnement (.env)

À placer à la racine du projet :

```ini
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tonpassword
DB_NAME=mysmartagenda_db
DB_PORT=5432
JWT_SECRET=UnSecretTresSecret123
En production (AlwaysData), les variables sont injectées automatiquement par le panel d’administration.

▶️ Installation et lancement local

# 1. Clone le projet
git clone https://github.com/toncompte/MySmartAgenda_BackEnd.git
cd MySmartAgenda_BackEnd

# 2. Installe les dépendances
npm install

# 3. Configure le fichier .env (voir ci-dessus)

# 4. Lance le serveur en local
node server.js
# ou pour forcer le port :
PORT=3000 node server.js
📚 Endpoints principaux
Utilisateurs
POST /users
Créer un utilisateur
Body JSON :

{ "name": "Alice", "email": "alice@example.com", "password": "monpassword" }
POST /users/login
Connexion, retourne un JWT
Body JSON :

{ "email": "alice@example.com", "password": "monpassword" }
Rendez-vous
POST /rendezvous (auth requis)
Créer un rendez-vous

GET /rendezvous (auth requis)
Tous les RDV de l’utilisateur connecté

GET /rendezvous/month?month=6&year=2025 (auth requis)
RDV d’un mois donné (pour affichage calendrier)

Tâches (To-Do)
POST /todos (auth requis)
Créer une tâche

GET /todos (auth requis)
Liste des tâches de l’utilisateur

PATCH /todos/:id (auth requis)
Modifier une tâche (statut, etc.)

🔒 Sécurité
Mots de passe hashés avec bcrypt

Authentification JWT : ajoutez dans les headers :

Authorization: Bearer VOTRE_TOKEN
Toutes les routes sensibles sont protégées par middleware JWT

🧪 Tests et debug
Tous les endpoints API ont été testés avec Postman.
Scénarios testés :
Création d’un utilisateur
Connexion et récupération d’un JWT
Utilisation du JWT pour accéder aux routes protégées (/rendezvous, /todos, etc.)
Test des statuts, filtrages calendrier, tâches urgentes, etc.

Route de test :
GET /test
→ doit retourner :
{ "ok": true }
Exemple de requête Postman :
Créer un utilisateur :
Method: POST
URL: /users
Body (JSON):
{
  "name": "Alice",
  "email": "alice_test@example.com",
  "password": "Azerty@11"
}
Connexion utilisateur :
Method: POST
URL: /users/login
Body (JSON):
{
  "email": "alice_test@example.com",
  "password": "Azerty@11"
}

→ Récupère le token et ajoute-le dans les Headers :
Authorization: Bearer VOTRE_TOKEN
Utilisation du token :
Appelle /rendezvous, /todos, etc., en passant le JWT dans les headers.
☁️ Déploiement (AlwaysData)
API déployée sur AlwaysData
Port dynamique (AlwaysData passe automatiquement le bon port via process.env.PORT)
BDD PostgreSQL hébergée chez AlwaysData

📌 Auteur
Guillaume Moussa – Démo back-end pour projet étudiant / pro.

💡 Améliorations possibles
Pagination, recherche
Tests automatisés (Jest, Supertest…)
Documentation OpenAPI/Swagger
Front React/Vue connecté

