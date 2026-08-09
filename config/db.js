const mongoose = require("mongoose");


require("dotenv").config();

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected Succesfully")

    }catch(err){
        console.log("error in connection", err.message);
    }
}

module.exports=connectDB;