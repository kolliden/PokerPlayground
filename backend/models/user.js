const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config').jwtSecret;

// User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "Username is required",
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: "Email is required",
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: "Password is required",
        minlength: 6,
    },
    phoneNumber: {
        type: String,
        required: "Phone number is required",
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        required: true,
        default: "0x01",
    },
    level: {
        type: Number,
        required: true,
        default: 0,
    },
    xp: {
        type: Number,
        required: true,
        default: 0,
    },
    rank: {
        type: String,
        required: true,
        enum: ["Copper", "Silver", "Gold", "Platinum", "Unranked"],
        default: "Unranked",
    },
},
    {
        timestamps: true,
    });
userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});
userSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
    };
    return jwt.sign(payload, jwtSecret, {
        expiresIn: '20m',
    });
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
