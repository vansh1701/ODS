const jwt = require("jsonwebtoken");
const signupd = require("../models/signupd");
const signupm = require("../models/signupm");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, process.env.SECRET_KEY);

        const user = await signupd.findOne({ _id: verifyuser._id });
        const userm = await signupm.findOne({ _id: verifyuser._id });

        if (user) {
            res.user = user;
        } else if (userm) {
            res.userm = userm;
        } else {
            throw new Error('User not found');
        }

        next();
    } catch (error) {
        res.status(401).send("Unauthorized: No token provided");
    }
};

module.exports = auth;
