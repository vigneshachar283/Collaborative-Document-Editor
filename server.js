require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const router = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");

app.use("/document", documentRoutes);

app.use("/user", router);

const port = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
    res.send("Collaborative Document Editor API is running");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});