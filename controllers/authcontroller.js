const User = require("./../models/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();


const registeruser = async(req,res)=>{
 try{
    const{name,email,password}=req.body;

    
     
    const user = await User.findOne({email:email});

    if(user){
        res.status(400).send("Email Already Exists")
        return ;
    }

    const hashedpassword = await bcrypt.hash(password,10);
 const newUser = new User({
       name:name,
       email:email,
       password:hashedpassword  
    })

    await newUser.save();

    res.status(201).json({
        "message":"user created succesfully",
        name : name ,
        email :email
    })
}catch(err){
    res.status(500).json({ message :"Internal server error",
        error:err.message});
 }
}

const loginUser = async (req,res)=>{

try{
const { email,password}=req.body;

const existingUser = await User.findOne({email});

if(!existingUser){
    res.status(401).send("USER NOT FOUND ");
    return ;
}

const login = await  bcrypt.compare(password,existingUser.password);

if(login){
  

    const token = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);

  res.status(200).json({
    "message":"Login Successfull",
    token:token
  })




}
else{
    res.status(401).send("Incorrect Password");
}

}catch(err){

    res.status(500).json({
        "message":" Internal server Error",
        error:err.message
    })

}
   

}




module.exports={registeruser,loginUser};