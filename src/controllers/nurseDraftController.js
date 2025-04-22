const NurseDraft = require('../models/nurseDraft');

// إنشاء مسودة ممرضة جديدة (Create)
exports.createNurseDraft = async (req, res) => {
  try {
    const nurseDraft = new NurseDraft(req.body);
    await nurseDraft.save();
    res.status(201).json({ message: 'NurseDraft created successfully', nurseDraft });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// جلب كل مسودات الممرضين (Read All)
exports.getAllNurseDrafts = async (req, res) => {
  try {
    const drafts = await NurseDraft.find();
    res.status(200).json(drafts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب مسودة ممرضة معينة بواسطة الـ ID (Read One)
exports.getNurseDraftById = async (req, res) => {
  try {
    const nurseDraft = await NurseDraft.findById(req.params.id);
    if (!nurseDraft) {
      return res.status(404).json({ message: 'NurseDraft not found' });
    }
    res.status(200).json(nurseDraft);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تحديث مسودة ممرضة معينة (Update)
exports.updateNurseDraft = async (req, res) => {
  try {
    const nurseDraft = await NurseDraft.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!nurseDraft) {
      return res.status(404).json({ message: 'NurseDraft not found' });
    }
    res.status(200).json({ message: 'NurseDraft updated successfully', nurseDraft });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف مسودة ممرضة معينة (Delete)
exports.deleteNurseDraft = async (req, res) => {
  try {
    const nurseDraft = await NurseDraft.findByIdAndDelete(req.params.id);
    if (!nurseDraft) {
      return res.status(404).json({ message: 'NurseDraft not found' });
    }
    res.status(200).json({ message: 'NurseDraft deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
