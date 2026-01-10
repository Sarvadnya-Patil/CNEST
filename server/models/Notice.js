const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    formTitle: { type: String }, // Explicit title for the form modal (different from event title)
    formDescription: { type: String }, // Detailed instructions for the form modal
    date: { type: Date, default: Date.now },
    acceptingResponses: { type: Boolean, default: true },
    noticeBgImage: { type: String },
    formBgImage: { type: String },
    design: {
        fontFamily: { type: String, default: 'Roboto' },
        headerColor: { type: String, default: '#673ab7' }, // Google Forms Purple
        titleFontSize: { type: String, default: '24pt' },
        titleBold: { type: Boolean, default: false },
        titleItalic: { type: Boolean, default: false },
        bodyFontSize: { type: String, default: '11pt' },
        bodyBold: { type: Boolean, default: false },
        bodyItalic: { type: Boolean, default: false }
    },
    formFields: [{
        label: { type: String, required: true },
        type: { type: String, default: 'text' }, // text, number, email, date, dropdown, file, radio
        options: { type: [String] }, // For dropdowns/radio
        fileValidation: {
            allowedTypes: { type: [String], default: [] }, // e.g. ['application/pdf', 'image/*']
            maxSizeInMB: { type: Number, default: 10 }
        },
        required: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('Notice', NoticeSchema);
