const client = require('../db');
const bcrypt = require('bcrypt');

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
        password VARCHAR(255) NOT NULL
      );
    `;
    await client.query(query);
  }

  async save() {
    // Hasher le mot de passe avant insertion
    const hashedPassword = await bcrypt.hash(this.password, 10); // 10 = salt rounds
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [this.name, this.email, hashedPassword];
    const res = await client.query(query, values);
    return res.rows[0];
  }

  static async getAll() {
    const res = await client.query('SELECT id, name, email FROM users');
    return res.rows;
  }
  static async findByEmail(email) {
    const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  }
  static async comparePassword(plainPassword, hashedPassword) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  // Méthode pour vérifier le mot de passe
  static async verifyPassword(email, plainPassword) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const res = await client.query(query, [email]);
  const user = res.rows[0];
  if (!user) return false;

  const isMatch = await bcrypt.compare(plainPassword, user.password);
  if (isMatch) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } else {
    return false;
  }
  }
}

module.exports = User;
