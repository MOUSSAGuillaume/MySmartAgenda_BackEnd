const client = require('../db');

class Todo {
  constructor(title, description, status, due_date, user_id) {
    this.title = title;
    this.description = description;
    this.status = status || 'pending';
    this.due_date = due_date;
    this.user_id = user_id;
  }

  // Méthode statique pour créer la table "todos"
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        due_date DATE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    await client.query(query);
  }

  async save() {
    const query = `
      INSERT INTO todos (title, description, status, due_date, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [this.title, this.description, this.status, this.due_date, this.user_id];
    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Méthode pour récupérer toutes les tâches de l'utilisateur
  static async getAllByUser(user_id) {
    const query = `
      SELECT * FROM todos
      WHERE user_id = $1
      ORDER BY due_date NULLS LAST;
    `;
    const res = await client.query(query, [user_id]);
    return res.rows;
  }

  // Méthode pour récupérer les tâches par mois et année
  static async getByMonth(user_id, month, year) {
    const query = `
    SELECT * FROM todos
    WHERE user_id = $1
      AND due_date IS NOT NULL
      AND EXTRACT(MONTH FROM due_date) = $2
      AND EXTRACT(YEAR FROM due_date) = $3
    ORDER BY due_date;
  `;
    const values = [user_id, month, year];
    const res = await client.query(query, values);
    return res.rows;
  }

  // Méthode pour mettre à jour une tâche par son ID
  static async deleteById(id, user_id) {
    const query = `DELETE FROM todos WHERE id = $1 AND user_id = $2`;
    await client.query(query, [id, user_id]);
  }

  // Méthode pour marquer une tâche comme terminée
  static async markAsDone(id, user_id) {
    const query = `
    UPDATE todos
    SET status = 'done'
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
    const res = await client.query(query, [id, user_id]);
    return res.rows[0];
  }

  // Méthode pour récupérer les tâches urgentes sans date d'échéance
  static async getUrgentTasks(user_id) {
    const query = `
    SELECT * FROM todos
    WHERE user_id = $1
      AND status = 'urgent'
      AND due_date IS NULL
    ORDER BY id DESC;
  `;
    const res = await client.query(query, [user_id]);
    return res.rows;
  }

}

module.exports = Todo;

// Le champ "status" peut prendre les valeurs suivantes :
// - "pending" : tâche en attente
// - "done"    : tâche terminée
// - "urgent"  : tâche prioritaire à afficher dans le calendrier
