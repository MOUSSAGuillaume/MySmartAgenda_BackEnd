const client = require('../db');

class Rendezvous {
  constructor(title, description, date, time, user_id) {
    this.title = title;
    this.description = description;
    this.date = date; // au format YYYY-MM-DD
    this.time = time; // au format HH:MM (optionnel)
    this.user_id = user_id;
  }

  // Crée la table si elle n'existe pas
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS rendezvous (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    await client.query(query);
  }

  // Sauvegarde un rendez-vous
  async save() {
    const query = `
      INSERT INTO rendezvous (title, description, date, time, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [this.title, this.description, this.date, this.time, this.user_id];
    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Récupérer les rendez-vous par utilisateur
  static async getAllByUser(user_id) {
    const query = `
      SELECT * FROM rendezvous
      WHERE user_id = $1
      ORDER BY date, time;
    `;
    const res = await client.query(query, [user_id]);
    return res.rows;
  }

  // Récupérer les rendez-vous par mois et année
  static async getByMonth(user_id, month, year) {
  const query = `
    SELECT * FROM rendezvous
    WHERE user_id = $1
      AND EXTRACT(MONTH FROM date) = $2
      AND EXTRACT(YEAR FROM date) = $3
    ORDER BY date, time;
  `;
  const values = [user_id, month, year];
  const res = await client.query(query, values);
  return res.rows;
}

}

module.exports = Rendezvous;
