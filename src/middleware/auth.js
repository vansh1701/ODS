const jwt = require("jsonwebtoken");
const signupd = require("../models/signupd");



const auth = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verifyuser);
        const user = await signupd.findOne({_id:verifyuser._id});
        // console.log(user,'USERDATA'); 
        res.user=user;
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}



module.exports = auth;