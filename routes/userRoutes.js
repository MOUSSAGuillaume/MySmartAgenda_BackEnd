const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// POST /users : créer un utilisateur
router.post('/', UserController.createUser);

// GET /users : récupérer tous les utilisateurs
router.get('/', UserController.getAllUsers);

// Route pour login
router.post('/login', userController.login);

module.exports = router;
