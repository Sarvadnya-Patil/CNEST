const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    event: { type: String, required: true },
    details: { type: Object } // Flexible field for extra details
}, { timestamps: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
