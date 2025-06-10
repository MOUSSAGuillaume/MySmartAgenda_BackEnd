const express = require('express');
const userRoutes = require('./routes/userRoutes');
const rendezvousRoutes = require('./routes/rendezvousRoutes');

const User = require('./models/User');
const Rendezvous = require('./models/Rendezvous');

const app = express();
app.use(express.json());

// Déclaration des routes
app.use('/users', userRoutes);
app.use('/rendezvous', rendezvousRoutes);

const PORT = 3000;

// Création des tables et démarrage du serveur
(async () => {
  try {
    await User.createTable();
    await Rendezvous.createTable();

    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur à la création des tables:', err);
  }
})();
