const express = require('express');

const userRoutes = require('./routes/userRoutes');
const rendezvousRoutes = require('./routes/rendezvousRoutes');
const todoRoutes = require('./routes/todoRoutes');

const Todo = require('./models/todo');
const User = require('./models/User');
const Rendezvous = require('./models/Rendezvous');

const app = express();
app.use(express.json());
app.use('/todos', todoRoutes);


// Déclaration des routes
app.use('/users', userRoutes);
app.use('/rendezvous', rendezvousRoutes);

const PORT = 3000;

// Création des tables et démarrage du serveur
(async () => {
  try {
    await User.createTable(); // Assurez-vous que la table User est créée
    await Rendezvous.createTable(); // Assurez-vous que la table Rendezvous est créée
    await Todo.createTable(); // Assurez-vous que la table Todo est créée
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur à la création des tables:', err);
  }
})();