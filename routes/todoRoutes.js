const express = require('express'); // Importer les modules nécessaires
const router = express.Router(); // Routeur pour les tâches Todo
const TodoController = require('../controllers/todoController'); // Contrôleur pour les tâches Todo
const authenticateToken = require('../middlewares/authMiddleware'); // Middleware pour authentifier l'utilisateur

router.post('/', authenticateToken, TodoController.create); // Créer une nouvelle tâche
router.get('/', authenticateToken, TodoController.getAll); // Récupérer toutes les tâches de l'utilisateur
router.get('/month', authenticateToken, TodoController.getByMonth); // Récupérer les tâches par mois et année
router.delete('/:id', authenticateToken, TodoController.delete); // Supprimer une tâche par ID
router.patch('/:id/done', authenticateToken, TodoController.markDone); // Marquer une tâche comme terminée
router.get('/urgent', authenticateToken, TodoController.getUrgent); // Récupérer les tâches urgentes sans date d'échéance

module.exports = router;
