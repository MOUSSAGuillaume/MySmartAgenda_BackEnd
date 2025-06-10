const Todo = require('../models/todo');

class TodoController {
    static async create(req, res) {
        try {
            const { title, description, status, due_date } = req.body;
            const user_id = req.user.id;

            if (!title) {
                return res.status(400).json({ error: 'Le titre est requis.' });
            }

            const todo = new Todo(title, description, status, due_date, user_id);
            const saved = await todo.save();
            res.status(201).json(saved);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getAll(req, res) {
        try {
            const user_id = req.user.id;
            const todos = await Todo.getAllByUser(user_id);
            res.json(todos);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Méthode pour récupérer les tâches par mois et année
    static async getByMonth(req, res) {
        try {
            const user_id = req.user.id;
            const { month, year } = req.query;

            if (!month || !year) {
                return res.status(400).json({ error: 'Mois et année requis.' });
            }

            const todos = await Todo.getByMonth(user_id, month, year);
            res.json(todos);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


}

module.exports = TodoController;

// Le champ "status" peut prendre les valeurs suivantes :
// - "pending" : tâche en attente
// - "done"    : tâche terminée
// - "urgent"  : tâche prioritaire à afficher dans le calendrier
