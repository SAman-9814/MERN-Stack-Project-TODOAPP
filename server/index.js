const express = require("express");
const cors = require("cors");
const app = express();

//load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(cors());

//middleware to parse json request body
app.use(express.json());

//import routes for to API
const todoRoutes = require("./routes/todos");

//mount the todo API routes
app.use("/api/v1", todoRoutes);

//start server
app.listen(PORT, () => {
    console.log(`Server started sucessfully at ${PORT}`);
})

//connect to the database
const dbConnect = require("./config/database");
dbConnect();

//default Route
app.get("/", (req, res) => {
    res.send(`<h1>This is Aman Sah</h1>`);
})