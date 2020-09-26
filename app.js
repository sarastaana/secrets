//start of DEFAULTS
require("dotenv").config(); //recommended putting at the top
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express =require("express");
const encrypt = require("mongoose-encryption");


const app =express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true, useUnifiedTopology:true});
//end of DEFAULTS

const usersSchema= new mongoose.Schema({  //for encrypting
  email:String,
  password:String
});
//const secret="Thisisourlittlesecret.";
usersSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']}); //set before model


const User = mongoose.model("User", usersSchema);



app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });

  newUser.save(function(err){
    if (!err){
      res.render("secrets");
    }
    else{console.log(err);}
  });
});

app.post("/login",function(req,res){
const username = req.body.username;
const password = req.body.password;

User.findOne({email:username}, function(err, foundUser){
  if (err){
    console.log(err);
  }

  else{
    if (foundUser){
      if (foundUser.password===password){
        res.render("secrets");
      }
      else{}
    }
    else {}
  }
});



});

app.listen(3000, function(req, res){
  console.log("Server is running...");
});
