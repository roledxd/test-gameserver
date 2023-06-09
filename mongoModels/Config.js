const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    }
});