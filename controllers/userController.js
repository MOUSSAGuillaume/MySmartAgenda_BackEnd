const User = require('../models/User');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'vraiment_pas_secret_en_prod'; // À mettre en .env plus tard

class UserController {
    static async createUser(req, res) {
        try {
            const { name, email, password } = req.body;
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email déjà utilisé.' });
            }
            const user = new User(name, email, password);
            const savedUser = await user.save();
            res.status(201).json(savedUser);
        } catch (err) {
            if (err.code === '23505') {
                // Code erreur PostgreSQL pour violation de contrainte UNIQUE
                res.status(400).json({ error: 'Cet email est déjà utilisé.' });
            } else {
                res.status(500).json({ error: err.message });
            }
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await User.getAll();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis.' });
        }

        try {
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé.' });
            }

            const isMatch = await User.comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Mot de passe incorrect.' });
            }

            const { password: _, ...userSansPassword } = user;
            const token = jwt.sign(userSansPassword, SECRET_KEY, { expiresIn: '1h' });

            res.json({
                message: 'Connexion réussie',
                token,
                user: userSansPassword
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

}

module.exports = UserController;
