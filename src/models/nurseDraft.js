
const mongoose = require('mongoose');

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NurseDraftSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [uuidRegex, 'Invalid UUID format']
  },
  patient_id: { 
    type: String, 
    match: [uuidRegex, 'Invalid UUID format']
  },
  certificates: { type: [{ status: String, image: String }], default: [] },
  graduation_college: { type: { status: String, college: String } },
  bank_details: { type: { object: Object, status: String } },
  status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft' }
});

module.exports = mongoose.model('NurseDraft', NurseDraftSchema);
