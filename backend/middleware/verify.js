const User = require( "../models/user.js");
const jwt = require("jsonwebtoken");
const config = require("../config");

async function verify(req, res, next) {
    try {
        const authHeader = req.headers["cookie"]; // get the session cookie from request header

        if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
        //Get SessionID cookie info
        let sessionID;
        authHeader.split("; ").forEach(element => {
            const temp = element.split("SessionID=")[1];
            if (temp) {
                sessionID = temp;
            };
        });

        // Verify using jwt to see if token has been tampered with or if it has expired.
        // that's like checking the integrity of the cookie
        jwt.verify(sessionID, config.jwtSecret, async (err, decoded) => {
            if (err) {
                // if token has been altered or has expired, return an unauthorized error
                return res
                    .status(401)
                    .json({ message: "This session has expired. Please login" });
            }

            const { id } = decoded; // get user id from the decoded token
            const user = await User.findById(id); // find user by that `id`
            const { password, ...data } = user._doc; // return user object without the password
            req.user = data; // put the data object into req.user
            next();
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}
module.exports = verify;