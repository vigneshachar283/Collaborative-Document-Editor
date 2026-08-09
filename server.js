require("dotenv").config();

const connectDB= require("./config/db")
const router=require("./routes/authRoutes")




app.use(express.json());


app.use("/user",router);



const port = process.env.PORT || 3000;



connectDB();


app.get("/",(req,res)=>{
    res.send("APPLY TRACK IS RUNNING ")
})
















app.listen(port,()=>{
    console.log(`Server is ruuning on the port ${port} `);
}
)