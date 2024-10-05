const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
        unique: true,
    },
    shortedUrl: {
        type: String,
        required: true,
        unique: true,
    },
    clickCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const urlModel = mongoose.model('urlModel', shortUrlSchema);

module.exports = urlModel;