const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
