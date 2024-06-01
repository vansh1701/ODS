const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const port = 180;
const bcrypt = require("bcryptjs");
const ejs = require("ejs");


require("./db/conn");

const static_path = path.join(__dirname, "../templates/views");
const template_path = path.join(__dirname, "../templates/views");

app.use(express.static(static_path));
app.set('view engine', 'ejs');
app.set("views", static_path);

const SignUpUser = require('../src/models/signupd');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(session({
    secret: 'hello',  // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }  // Session will expire in 60 seconds for this example
}));

app.get("/",(req,res)=>{
    res.render("login");
});

app.get("/about",(_,resp)=>{
    resp.render('about');
});

app.get("/contact",(_,resp)=>{
    resp.render('contact');
});

app.get("/login",(_,resp)=>{
    resp.render('login');
});

app.get("/signup",(_,resp)=>{
    resp.render("signup");
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
    res.status(201).redirect("login");
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

        if (!user) {
            console.log("User not found with dempid:", dempid);  // Debugging line
            return res.status(400).send("User not found");
        }

        

        if (password == user.password) {
            req.session.user = user;
            console.log('Login successful');
            res.render("home");
        } else {
            console.log("Invalid password for dempid:", dempid);  // Debugging line
            res.send("Invalid password details");
        }
    } catch (error) {
        console.error("Error during login:", error);  // Debugging line
        res.status(400).send(error);
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

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error logging out");
        }
        res.redirect("/login");
    });
});


app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});