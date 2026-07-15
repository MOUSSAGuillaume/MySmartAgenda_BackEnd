# 📅 MySmartAgenda - Backend API REST
![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Secured-success)
![MariaDB](https://img.shields.io/badge/MariaDB-11-003545?logo=mariadb&logoColor=white)

---
  Présentation

MySmartAgenda** est une API REST développée en **PHP 8** dans le cadre de la préparation du titre professionnel "Développeur Web et Web Mobile (DWWM)".
L'objectif du projet est de proposer une solution simple, sécurisée et évolutive permettant à un utilisateur authentifié de gérer ses rendez-vous et ses tâches personnelles.
L'application repose sur une architecture **MVC**, une authentification **JWT**, une base de données **MariaDB** et une conteneurisation complète avec **Docker** afin de faciliter son développement et son déploiement.
Une interface web développée avec **Bootstrap 5** accompagne l'API afin de démontrer facilement l'ensemble des fonctionnalités sans utiliser Postman.
Le projet a également été pensé pour évoluer vers une solution plus complète grâce à l'intégration de fonctionnalités telles que :
- synchronisation avec Google Calendar ou Outlook ;
- rappels automatiques par e-mail ;
- notifications avant les rendez-vous ;
- partage d'agendas ;
- développement d'une application mobile Android ou iOS reposant sur la même API REST.
Cette architecture permet de faire évoluer l'application sans remettre en cause le backend déjà développé.

---
  Pourquoi ce projet ?

Ce projet a été réalisé afin de mettre en pratique les compétences attendues d'un développeur backend :
- Concevoir une API REST.
- Développer une architecture MVC.
- Utiliser la programmation orientée objet.
- Manipuler une base de données relationnelle.
- Sécuriser les accès avec JWT.
- Développer un CRUD complet.
- Conteneuriser une application avec Docker.
- Préparer un projet pour un futur déploiement.

---
  Architecture

Toutes les requêtes transitent par un **point d'entrée unique** (`public/index.php`).

Celui-ci analyse la requête HTTP, sélectionne la route correspondante, instancie le contrôleur puis délègue les opérations vers les repositories responsables des échanges avec la base de données.

```
Navigateur

      │

      ▼

Bootstrap 5

      │

      ▼

public/index.php

      │

      ▼

     Router

      │

      ▼

 Controllers

      │

      ▼

Repositories

      │

      ▼

   MariaDB

```
Cette organisation facilite la maintenance du projet, améliore la lisibilité du code et permet d'ajouter facilement de nouvelles fonctionnalités.

---
  Technologies utilisées

| Technologie | Utilisation |
|-------------|-------------|
| PHP 8.3 | Développement backend |
| MariaDB 11 | Base de données relationnelle |
| Docker | Conteneurisation |
| Nginx | Serveur Web |
| JWT | Authentification |
| Composer | Gestion des dépendances |
| Bootstrap 5 | Interface de démonstration |

---
  Fonctionnalités

Authentification
- Création d'un compte
- Connexion
- Génération d'un JWT
- Protection des routes privées

Gestion des rendez-vous
- Création
- Consultation
- Modification
- Suppression

Gestion des tâches
- Création
- Consultation
- Modification
- Suppression

---
  Sécurité

Plusieurs mécanismes de sécurité ont été mis en place :
- Authentification par JWT.
- Hashage sécurisé des mots de passe.
- Requêtes préparées PDO contre les injections SQL.
- Variables sensibles stockées dans le fichier `.env`.
- Gestion centralisée des exceptions.
- Protection XSS côté interface grâce à l'échappement des données avant affichage.

---
  Utilisation de l'API

Toutes les fonctionnalités sont accessibles via une API REST.
L'API peut être utilisée :
- depuis l'interface de démonstration (`demo.html`) ;
- avec un client HTTP comme **Postman** ou **Insomnia** ;
- par une application web ou mobile.

Le fonctionnement général est le suivant :

1. Création d'un compte
L'utilisateur crée son compte en envoyant ses informations personnelles.

```http
POST /api/register
```
2. Connexion
Une fois inscrit, l'utilisateur s'authentifie.

```http
POST /api/login
```

L'API retourne alors un JSON Web Token (JWT).

```json
{
    "token": "eyJhbGc..."
}
```

3. Utilisation du JWT
Le token doit être envoyé dans chaque requête nécessitant une authentification.

```http
Authorization: Bearer VOTRE_JWT
```

Exemple d'une requête :

```http
POST /api/appointments
```

```json
{
    "title": "Dentiste",
    "description": "Contrôle annuel",
    "appointment_date": "2026-07-15 14:30:00"
}
```

Réponse :

```json
{
    "message": "Rendez-vous créé",
    "appointment_id": 5
}
```

---
  Principaux endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/register` | Création d'un compte |
| POST | `/api/login` | Authentification |
| GET | `/api/me` | Utilisateur connecté |
| GET | `/api/appointments` | Liste des rendez-vous |
| POST | `/api/appointments` | Création d'un rendez-vous |
| PUT | `/api/appointments/{id}` | Modification d'un rendez-vous |
| DELETE | `/api/appointments/{id}` | Suppression d'un rendez-vous |
| GET | `/api/tasks` | Liste des tâches |
| POST | `/api/tasks` | Création d'une tâche |
| PUT | `/api/tasks/{id}` | Modification d'une tâche |
| DELETE | `/api/tasks/{id}` | Suppression d'une tâche |

---
  Démonstration

Une interface Bootstrap est intégrée au projet afin de présenter facilement les fonctionnalités du backend.
Elle permet :
- Authentification JWT.
- Gestion complète des rendez-vous.
- Gestion complète des tâches.
- Démonstration visuelle du CRUD.
- Interaction avec l'API en temps réel.

<img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/fe339ddd-229e-49bb-b455-ca6128c53db9" />

---
  Déploiement

Le projet est entièrement conteneurisé avec Docker.
L'application peut être démarrée avec :

```bash
docker compose up -d --build
```

Accès :

- API : `http://localhost:8080`
- Démonstration : `http://localhost:8080/demo.html`

Pour un déploiement en production, il est recommandé :
- d'utiliser HTTPS ;
- de conserver les secrets dans les variables d'environnement ;
- de ne pas exposer phpMyAdmin publiquement.

---
  Compétences mises en œuvre

| Domaine | Compétences |
|----------|-------------|
| PHP | POO, Namespaces, Composer |
| Architecture | MVC, Repository Pattern |
| API | REST, JSON, Codes HTTP |
| Base de données | MariaDB, PDO |
| Sécurité | JWT, Hashage, SQL Injection, XSS |
| DevOps | Docker, Nginx |
| Versionnement | Git & GitHub |

---
  Perspectives d'évolution

L'architecture retenue permet d'ajouter facilement de nouvelles fonctionnalités, parmi lesquelles :

- Synchronisation Google Calendar.
- Synchronisation Outlook.
- Notifications par e-mail.
- Notifications Push.
- Calendrier interactif.
- Application mobile Android / iOS.
- Partage d'agendas.
- Documentation OpenAPI / Swagger.
- Tests unitaires PHPUnit.

---
  Auteur

Guillaume Moussa

Projet réalisé dans le cadre de la préparation du titre professionnel :
Développeur Web et Web Mobile (DWWM)
---
> Ce projet met en œuvre les principales bonnes pratiques liées au développement d'une API REST moderne : architecture MVC, programmation orientée objet, authentification JWT, sécurisation des accès,
Docker et préparation au déploiement.
