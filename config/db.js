const mongoose=require('mongoose')

require('dotenv').config()

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)

        console.log("Database connected succesfully")

    }catch(err){
        console.log("Error in database connection",err.message)

    }
}

module.exports=connectDB;