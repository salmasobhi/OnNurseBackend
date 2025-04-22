
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    dob: Date,
    country: String,
    state: String,
    city: String,
    is_nurse: { type: Boolean, required: true },
    profile_picture: String,
    user_name: { type: String, unique: true, required: true },
    email: { 
      type: String, 
      unique: true, 
      required: true, 
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] 
    },
    password: { type: String, required: true, minlength: 6 },
    country_code: String,
    mobile_number: { 
      type: String, 
      required: true, 
      match: [/^\d{10,15}$/, 'Invalid mobile number'] 
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;
