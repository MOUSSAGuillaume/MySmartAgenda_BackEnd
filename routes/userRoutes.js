const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

// POST /users : créer un utilisateur
router.post('/', UserController.createUser);

// GET /users : récupérer tous les utilisateurs
router.get('/', authenticateToken, UserController.getAllUsers);

// Route pour login
router.post('/login', UserController.login);

module.exports = router;
