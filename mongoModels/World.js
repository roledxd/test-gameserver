const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isOwned: {
        type: Boolean,
        required: true
    },
    ownedBy: {
        type: String,
        required: true
    },
    isNuked: {
        type: Boolean,
        required: true
    },
    tiles: {
        type: Array,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    created_by: {
        type: Date,
        required: true
    },
    last_active: {
        type: Date,
        required: true
    },
    world_type: {
        type: String,
        required: true
    },
    world_rates: {
        type: Array,
        required: true
    }
});