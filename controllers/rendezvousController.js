const Rendezvous = require('../models/Rendezvous');

class RendezvousController {
  static async create(req, res) {
    try {
      const { title, description, date, time } = req.body;
      const user_id = req.user?.id; // récupéré via le token

      if (!title || !date || !user_id) {
        return res.status(400).json({ error: 'Titre, date et utilisateur requis' });
      }

      const rdv = new Rendezvous(title, description, date, time, user_id);
      const saved = await rdv.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getByUser(req, res) {
    try {
      const user_id = req.user?.id;
      const rendezvous = await Rendezvous.getAllByUser(user_id);
      res.json(rendezvous);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Récupérer les RDV par mois et année
  static async getByMonth(req, res) {
  try {
    const user_id = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Mois et année requis.' });
    }

    const rdvs = await Rendezvous.getByMonth(user_id, month, year);
    res.json(rdvs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

}

module.exports = RendezvousController;
