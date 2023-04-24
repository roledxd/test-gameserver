const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    account_type: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    last_active: {
        type: Date,
        required: true
    },
    ips: {
        type: Array,
        required: true
    },
    inventory: {
        type: Array,
        required: true
    },
    suspension: {
        type: Object,
        required: true
    }
});