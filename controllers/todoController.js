const Todo = require('../models/todo');

class TodoController {
    // Méthode pour créer une nouvelle tâche
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

    // Méthode pour récupérer toutes les tâches de l'utilisateur
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

    // Méthode pour supprimer une tâche
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user.id;

            await Todo.deleteById(id, user_id);
            res.json({ message: 'Tâche supprimée.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Méthode pour marquer une tâche comme terminée
    static async markDone(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user.id;

            const updated = await Todo.markAsDone(id, user_id);
            if (!updated) {
                return res.status(404).json({ error: 'Tâche introuvable.' });
            }

            res.json({ message: 'Tâche marquée comme terminée.', task: updated });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Méthode pour récupérer les tâches urgentes
    static async getUrgent(req, res) {
        try {
            const user_id = req.user.id;
            const urgentTodos = await Todo.getUrgentTasks(user_id);
            res.json(urgentTodos);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Méthode pour mettre à jour une tâche par son ID
    static async update(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user.id;
            const fields = req.body;

            if (!fields || Object.keys(fields).length === 0) {
                return res.status(400).json({ error: 'Aucune donnée à mettre à jour.' });
            }

            const updatedTodo = await Todo.updateById(id, user_id, fields);
            if (!updatedTodo) {
                return res.status(404).json({ error: 'Tâche non trouvée.' });
            }

            res.json({ message: 'Tâche mise à jour.', task: updatedTodo });
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
