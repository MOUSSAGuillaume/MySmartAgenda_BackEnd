require('dotenv').config();
const { Client } = require('pg');

// Configuration pour AlwaysData (production)
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect()
  .then(() => console.log('Connecté à PostgreSQL'))
  .catch(err => console.error('Erreur de connexion', err));

module.exports = client;

 // Pour une configuration DB pour le développement local mettez les valeurs appropriées

