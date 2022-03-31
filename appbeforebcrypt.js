//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose= require("mongoose");


const md5= require("md5");
// const encrypt= require("mongoose-encryption");



const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema=new mongoose.Schema(
    {
        email:String,
        password:String
    }
);
//encryption 
// console.log(process.env.SECRET);
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ['password']});



const User=mongoose.model("User",userSchema);


app.get("/", function(req, res){
  res.render("home");
});
app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register",function(req,res)
{
    const email=req.body.username;
    const password=req.body.password;


    const newUser=new User(
        {
            email:email,
            password:md5(password)
        }
    )
    
    newUser.save(function(err)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });
});
app.post("/login",function(req,res)
{
    const email=req.body.username;
    const password=md5(req.body.password);

    User.findOne({email:email},function(err,foundedData)
    {
        if(foundedData)
        {
            if(foundedData.password===password)
            {
                res.render("secrets");
            }
           
        }
        else{
            res.send("user does not exist!!");
        }
    });


});



app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
