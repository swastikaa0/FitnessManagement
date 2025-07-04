const express = require("express");
const {connection} = require("./Database/db");

const app = express();

const port = 4000;

app.use(express.json());
connection();


app.listen(port, () => {
    console.log("Server is running on port 4000")
});