require('dotenv').config();
const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const port = 180;
const bcrypt = require("bcryptjs");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");  
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");


require("./db/conn");

const static_path = path.join(__dirname, "../templates/views");
const template_path = path.join(__dirname, "../templates/views");

app.use(cookieParser());
app.use(express.static(static_path));
app.set('view engine', 'ejs');
app.set("views", static_path);

const SignUpUser = require('../src/models/signupd');
const SignUpMember = require('../src/models/signupm');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(session({
    secret: 'mynameisvanshmittal',  // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }  // Session will expire in 60 seconds for this example
}));

app.get("/",(req,res)=>{
    res.render("home_1");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/about", auth ,(req,res)=>{
    res.render("about",{
        userData:res.user
    })
});

app.get("/contact", auth ,(req,res)=>{
    res.render("contact",{
        userData:res.user
    })
});

app.get("/login",(_,resp)=>{
    resp.render('login');
});

app.get("/loginm",(_,resp)=>{
    resp.render('loginm');
});

app.get("/signup",(_,resp)=>{
    resp.render("signup");
});

app.get("/signupm",(_,resp)=>{
    resp.render("signupm");
});

app.get("/home", (req, res) => {
    if (req.session.user) {
        res.render("home");
    } else {
        res.redirect("/login");
    }
});

const signupd = require("./models/signupd");
app.post("/signupd", async(req,res) =>{
    try { 
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        
        if(password === confirm_password){
            console.log("ff");
            const registerDonor = new signupd({
                dname: req.body.dname,
                dempid : req.body.dempid,
                dphone : req.body.dphone,
                referID : req.body.referID,
                password : req.body.password, 
                confirm_password : req.body.confirm_password
            })
            console.log(registerDonor);
 const registerd = await registerDonor.save();
    res.status(201).render("home",{ userData: user 
    });
}else{
    res.send("passwords donot matching");
}
}catch (error) {
    res.status(400).send(error);
    }
})
app.post("/login", async (req, res) => {
    try {
        const { dempid, password } = req.body;

        console.log("Received dempid:", dempid);  // Debugging line
        console.log("Received password:", password);  // Debugging line

        const user = await SignUpUser.findOne({ dempid });
        console.log(user);
        if (!user) {
            console.log("User not found with dempid:", dempid);  // Debugging line
            return res.status(400).send("User not found");
        }

        const token = await user.generateAuthToken(); 
        res.cookie("jwt", token);
        

        if (password == user.password) {   
            req.session.user = user;
            console.log('Login successful');
            res.status(201).render("home",{ userData: user 
            });
        } else {
            console.log("Invalid password for dempid:", dempid);  // Debugging line
            res.send("Invalid password details");
        }
    } catch (error) {
        console.error("Error during login:", error);  // Debugging line
        res.status(400).send(error.message);
    }
});


const signupm = require("./models/signupm");
app.post("/signupm", async(req,res) =>{
    try { 
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        
        if(password === confirm_password){
            console.log("ff");
            const registermember = new signupm({
                dname: req.body.dname,
                dempid : req.body.dempid,
                dphone : req.body.dphone,
                referID : req.body.referID,
                password : req.body.password, 
                confirm_password : req.body.confirm_password
            })
            console.log(registermember);
 const registerd = await registermember.save();
    res.status(201).render("home_1");
}else{
    res.send("passwords donot matching");
}
}catch (error) {
    res.status(400).send(error);
    }
})
app.post("/loginm", async (req, res) => {
    try {
        const { dempid, password } = req.body;

        console.log("Received dempid:", dempid);  // Debugging line
        console.log("Received password:", password);  // Debugging line

        const user = await SignUpMember.findOne({ dempid });
        console.log(user);
        if (!user) {
            console.log("User not found with dempid:", dempid);  // Debugging line
            return res.status(400).send("User not found");
        }

        const token = await user.generateAuthToken(); 
        res.cookie("jwt", token);
        

        if (password == user.password) {   
            req.session.user = user;
            console.log('Login successful');
            res.status(201).render("home_2",{ userData: user 
            });
        } else {
            console.log("Invalid password for dempid:", dempid);  // Debugging line
            res.send("Invalid password details");
        }
    } catch (error) {
        console.error("Error during login:", error);  // Debugging line
        res.status(400).send(error.message);
    }
});


// app.post("/login", async(req, res) =>{
//     try{
//         const empID = req.body.dempid;
//         const password = req.body.password;
//         let uemail = await SignUpUser.findOne({dempid:empID});
//         console.log(uemail);
        
//         if(password == uemail.password){
//             console.log('hello');
//         res.render("home");
//         }else{
//             res.send("invalid password details");
//         }
//     }catch (error){
//         res.status(400).send(error)
//     }
// })

// app.get("/logout", (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             return res.status(500).send("Error logging out");
//         }
//         res.redirect("/login");
//     });
// });


app.get("/logout", auth ,async (req,res)=>{
    try {
        res.clearCookie("jwt");
        console.log("logged out successfully");
        res.render("home_1");
    } catch (error) {
        res.status(500).send(error);
    }
})


app.listen(port, ()=>{
    console.log('SECRET_KEY:', process.env.SECRET_KEY);

    console.log(`The application started successfully on port ${port}`);
});