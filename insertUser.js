const client = require('./db');

const query = `
INSERT INTO users (name, email, password)
VALUES ($1, $2, $3)
RETURNING *;
`;

const values = ['Alice', 'alice@example.com', 'password123'];

client.query(query, values)
  .then(res => {
    console.log('Utilisateur inséré:', res.rows[0]);
  })
  .catch(err => {
    console.error('Erreur insertion utilisateur', err);
  })
  .finally(() => {
    client.end();
  });
