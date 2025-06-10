const express = require('express');
const router = express.Router();
const RendezvousController = require('../controllers/rendezvousController');
const authenticateToken = require('../middlewares/authMiddleware');

// POST /rendezvous : créer un RDV
router.post('/', authenticateToken, RendezvousController.create);

// GET /rendezvous : récupérer tous les RDV de l’utilisateur
router.get('/', authenticateToken, RendezvousController.getByUser);

// GET /rendezvous/month : récupérer les RDV par mois et année
router.get('/month', authenticateToken, RendezvousController.getByMonth);

// DELETE /rendezvous/:id : supprimer un RDV par ID
router.delete('/:id', authenticateToken, RendezvousController.delete);

module.exports = router;
