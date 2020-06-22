//require useful modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const companiesRout = require("./routes/companiesRout.js");
const personnelRout = require("./routes/personnelRout.js");

//connect to mongodb 
mongoose.connect(
    "mongodb://localhost:27017/EmployeeSystem",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

//for use body parser
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

app.set("view engine", "ejs");// set ejs engine

app.use("/", express.static("public"));//make public this file

//pass req to routes
app.use("/companies", companiesRout);
app.use("/personnel", personnelRout);

app.listen(3000, function () {
    console.log("server started on port: 3000");
});