const mongoose = require('mongoose');

const NurseSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    patient_id: { type: String },
    certificates: { type: [String], default: [] },
    graduation_college: { type: String },
    bank_details: { type: Object }
});

module.exports = mongoose.model('Nurse', NurseSchema);

