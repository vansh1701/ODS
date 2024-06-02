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
    secret: 'mynameisvanshmittal',  
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }
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

app.get("/about_2", auth ,(req,res)=>{
    res.render("about_2",{
        usermData:res.userm
    })
});

app.get("/profilea", auth ,(req,res)=>{
    res.render("profilea",{
        userData:res.user
    })
});

app.get("/profilem", auth ,(req,res)=>{
    res.render("profilem",{
        usermData:res.userm
    })
});

app.get("/viewduty", auth ,(req,res)=>{
    res.render("viewduty",{
        usermData:res.userm
    })
});

app.get("/contact", auth ,(req,res)=>{
    res.render("contact",{
        userData:res.user
    })
});

app.get("/contact_2", auth ,(req,res)=>{
    res.render("contact_2",{
        usermData:res.userm
    })
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

app.use((req, res, next) => {
    if (req.session.user) {
        res.user = req.session.user; // Assuming req.session.user contains the user data
    }
    next();
});

app.use((req, res, next) => {
    if (req.session.userm) {
        res.userm = req.session.userm; // Assuming req.session.user contains the user data
    }
    next();
});

app.get("/home", (req, res) => {
    if (req.session.user) {
        res.render("home", {
            userData: req.session.user // Ensure userData is passed correctly
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/home_2", (req, res) => {
    if (req.session.userm) {
        res.render("home_2", {
            usermData: req.session.userm // Ensure userData is passed correctly
        });
    } else {
        console.log("unable");
    }
});

app.post("/edit", auth, async (req, res) => {
    try {
        const id = req.query.id; // Fetch the ID from the query parameter
        if (!id) {
            return res.status(400).send("ID parameter is missing");
        }

        console.log("ID from query:", id);
        console.log("Duty from body:", req.body.duty);
        console.log("Notes from body:", req.body.notes);

        let check = await SignUpMember.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    duty: req.body.duty,
                    notes: req.body.notes
                }
            },
            { upsert: true, new: true } 
        );

        console.log("Update result:", check);
        res.redirect('/schedule'); 
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

app.get("/schedule", auth, async (req, res) => {
    try {
        const referID = res.user ? res.user.referID : res.userm.referID;
        let checkd = await signupm.find({ referID: referID });
        if (!checkd) {
            checkd = [];
        }
        res.status(201).render("schedule", {
            checkd: checkd,
            userData: res.user || res.userm
        });
    } catch (error) {
        console.error("Error retrieving team members:", error);
        res.status(500).send("Error retrieving team members");
    }
});

app.get("/viewteam", auth, async (req, res) => {
    try {
        const referID = res.user ? res.user.referID : res.userm.referID;
        let checkd = await signupm.find({ referID: referID });
        if (!checkd) {
            checkd = [];
        }
        res.status(201).render("viewteam", {
            checkd: checkd,
            userData: res.user || res.userm
        });
    } catch (error) {
        console.error("Error retrieving team members:", error);
        res.status(500).send("Error retrieving team members");
    }
});

app.get("/viewduty2", auth, async (req, res) => {
    try {
        const referID = res.user ? res.user.referID : res.userm.referID;
        let checkd = await signupm.find({ referID: referID });
        if (!checkd) {
            checkd = [];
        }
        res.status(201).render("viewduty2", {
            checkd: checkd,
            userData: res.user || res.userm
        });
    } catch (error) {
        console.error("Error retrieving team members:", error);
        res.status(500).send("Error retrieving team members");
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
    res.status(201).render("home_1",{ userData: user 
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
                confirm_password : req.body.confirm_password,
                duty : "",
                notes : ""
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

        console.log("Received m dempid:", dempid);  // Debugging line
        console.log("Received password:", password);  // Debugging line

        const userm = await SignUpMember.findOne({ dempid });
        console.log(userm);
        if (!userm) {
            console.log("User not found with dempid:", dempid);  // Debugging line
            return res.status(400).send("User not found");
        }

        const token = await userm.generateAuthToken(); 
        res.cookie("jwt", token);
        

        if (password == userm.password) {   
            req.session.userm = userm;
            console.log('Login successful');
            res.status(201).render("home_2",{ usermData: userm 
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