const Nurse = require('../models/Nurse');

exports.createNurse = async (req, res) => {
    try {
        const nurse = new Nurse(req.body);
        await nurse.save();
        res.status(201).json(nurse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateNurse = async (req, res) => {
    try {
        const nurse = await Nurse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(nurse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteNurse = async (req, res) => {
    try {
        await Nurse.findByIdAndDelete(req.params.id);
        res.json({ message: 'Nurse deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllNurses = async (req, res) => {
  try {
      const nurses = await Nurse.find();
      res.json(nurses);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
