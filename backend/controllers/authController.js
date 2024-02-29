const User = require('../models/user');
const bcrypt = require('bcrypt');

async function register(req, res) {
    // get required variables from request body
    const { email, phoneNumber, username, password} = req.body;
    try {
        // create an instance of a user
        const newUser = new User({
            username,
            phoneNumber,
            email,
            password,
        });
        // Check if user already exists
        const existingUser = await User.findOne({ email }) || await User.findOne({ phoneNumber });
        if (existingUser)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
        const savedUser = await newUser.save(); // save new user into the database
        const { password, role, ...user_data } = savedUser._doc; // return user object without the password

        let options = {
            maxAge: 20 * 60 * 1000, // would expire in 20minutes
            httpOnly: true, // The cookie is only accessible by the web server
            // secure: true,
            sameSite: "None",
            // domain: "127.0.0.1",
        };

        req.session.user = user_data;
        req.session.save();

        const token = user.generateAccessJWT(); // generate session token for user
        res.cookie('SessionID', token, options)
        .status(200).json({
            status: "success",
            data: [user_data],
            message:
                "Thank you for registering with us. Your account has been successfully created.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
        console.log(err);
    }
    res.end();
}

const login = async (req, res) => {
    // Get variables for the login process
    const { username } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // if user exists
        // validate password

        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        );
        // if not valid, return unathorized response
        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // return user info except password
        const { password, role, ...user_data } = user._doc;

        let options = {
            maxAge: 20 * 60 * 1000, // would expire in 20minutes
            httpOnly: true, // The cookie is only accessible by the web server
            // secure: true,
            sameSite: "None",
            // domain: "127.0.0.1",
        };
        req.session.user = user_data;
        req.session.save();

        const token = user.generateAccessJWT(); // generate session token for user
        res.cookie('SessionID', token, options)
        .status(200).json({
            status: "success",
            data: [user_data],
            message: "You have successfully logged in.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
        console.log(err);
    }
    res.end();
};

const logout = async (req, res) => {
    try {
        req.session.destroy();

        //remove cookie
        res.clearCookie('SessionID');
        res.status(200).json({ message: 'Logout successful.' });
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.' });
    }
}
const me = async (req, res) => {
    try {
        res.status(200).json({ user: req.session.user, message: 'User found'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.' });
    }
}

module.exports = {
    register,
    login,
    logout,
    me,
};