const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, TodoController.create);
router.get('/', authenticateToken, TodoController.getAll);
router.get('/month', authenticateToken, TodoController.getByMonth);

module.exports = router;
