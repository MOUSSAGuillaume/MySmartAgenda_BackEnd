const express = require('express');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');

const app = express();
app.use(express.json());

// Routes
app.use('/users', userRoutes);

const PORT = 3000;

(async () => {
  try {
    await User.createTable(); // Crée la table si elle n'existe pas
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erreur à la création de la table:', err);
  }
})();
