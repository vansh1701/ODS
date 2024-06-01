const mongoose = require("mongoose");

const donor_signup = new mongoose.Schema({
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
        type:Number,
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
}) 

console.log('1');
const Signupd = new mongoose.model("Student", donor_signup);
module.exports = Signupd;