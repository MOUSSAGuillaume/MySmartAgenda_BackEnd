const express = require('express');

// Import des routes API
const userRoutes = require('./routes/userRoutes');
const rendezvousRoutes = require('./routes/rendezvousRoutes');
const todoRoutes = require('./routes/todoRoutes');

// Import des modèles pour création des tables
const Todo = require('./models/todo');
const User = require('./models/user');
const Rendezvous = require('./models/Rendezvous');

const app = express();
app.use(express.json()); // Pour parser le JSON des requêtes

// Route de test pour vérifier que le serveur tourne
app.get('/test', (req, res) => res.json({ ok: true }));

// Déclaration des routes API
app.use('/users', userRoutes);
app.use('/rendezvous', rendezvousRoutes);
app.use('/todos', todoRoutes);

// Définition du port et de l’hôte (Alwaysdata fournit PORT=8100)
const PORT = process.env.PORT || 3000; // 3000 en local sinon 8100 sur Alwaysdata
const HOST = process.env.HOST || '0.0.0.0'; // 0.0.0.0 pour accepter toutes les connexions externes

// Démarrage : création des tables puis lancement du serveur
(async () => {
  try {
    await User.createTable();        // Crée la table users si elle n’existe pas
    await Rendezvous.createTable();  // Crée la table rendezvous si besoin
    await Todo.createTable();        // Crée la table todos si besoin

    // Une fois toutes les tables prêtes, on démarre l’API
    console.log('Valeur de process.env.PORT :', process.env.PORT);

    app.listen(PORT, HOST, () => {
      console.log(`✅ Serveur démarré sur http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur à la création des tables:', err);
  }
})();
