// user.js
const client = require('../db');

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `;
    await client.query(query);
  }

  async save() {
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [this.name, this.email, this.password];
    const res = await client.query(query, values);
    return res.rows[0];
  }

  static async getAll() {
    const res = await client.query('SELECT * FROM users');
    return res.rows;
  }
}

module.exports = User;
