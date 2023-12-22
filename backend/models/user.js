const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
    userID :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    balance: {
        type: Number,
        default: 0,
    },
    // Other user-related fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;
