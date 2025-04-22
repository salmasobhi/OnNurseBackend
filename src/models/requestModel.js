
// const mongoose = require('mongoose');

// const RequestSchema = new mongoose.Schema({
//     user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true},
//     images: [String],
//     title: String,
//     description: String,
//     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
//     interested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     comments: Object,
//     status: { type: String, enum: ['valid', 'expired', 'in_progress', 'pending', 'completed'] },
//     assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     price: Number,
//     offers: []
// }, { timestamps: true });

// const Request = mongoose.model('Request', RequestSchema);

// module.exports = Request;  


const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },  // ✅ ضروري
    description: { type: String, required: true },
    phone: { type: Number, required: true },  // ✅ ضروري
    images: { type: Array, default: [] },
    status: { type: String, enum: ["open", "in_progress","closed"], default: "open" },
    request_id: { type: mongoose.Schema.Types.ObjectId, ref: "AnotherModel" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", requestSchema);
