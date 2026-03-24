const mongoose = require('mongoose');  
const feedbackSchema = new mongoose.Schema({   userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   message: { type: String, required: true, maxlength: 1000 }, }, { timestamps: true });  
module.exports = mongoose.model('Feedback', feedbackSchema);