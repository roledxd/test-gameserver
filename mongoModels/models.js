const mongoose = require("mongoose");


const WorldSchema = require('./World');
const World = mongoose.model('World', WorldSchema);

const UserSchema = require('./User');
const User = mongoose.model('User', UserSchema);

const ConfigSchema = require('./Config');
const Config = mongoose.model('Config', ConfigSchema);

module.exports = {
    Config, World, User
};