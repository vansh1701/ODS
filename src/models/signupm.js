const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const member_signup = new mongoose.Schema({
    dname : {
        type:String
    },
    dempid : {
        type:String,
        unique:true,
        require:true
    },
    dphone : {
        type:Number,
        require:true
    },
    referID : {
        type:String,
        require:true
    },
    password : {
        type:String,
        require:true
    },
    confirm_password : {
        type:String,
        require:true
    },
    duty : {
        type:String
    },
    notes : {
        type:String
    },
    tokens:[{
        token:{
            type:String 
        }
    }]
}) 


member_signup.methods.generateAuthToken = async function() {
    try {
        console.log(this._id.toString());
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save(); 
        return token;
    } catch (error) {
        console.error("Error generating auth token:", error);
        throw new Error("Error generating auth token");
    }
}


console.log('1');
const Signupd = new mongoose.model("Member", member_signup);
module.exports = Signupd;