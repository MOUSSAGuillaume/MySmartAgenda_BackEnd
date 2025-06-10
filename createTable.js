const client = require('./db');

const query = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);
`;

client.query(query)
  .then(() => {
    console.log('Table users créée ou déjà existante');
  })
  .catch(err => {
    console.error('Erreur lors de la création de la table', err);
  })
  .finally(() => {
    client.end();
  });
