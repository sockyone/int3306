const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require("config");

const app = express();

let PORT = process.env.PORT || config.get("server.port") || 3000;
let MONGO_URL = process.env.MONGO_URL || config.get("mongo.url") || "mongodb://localhost:27017/surveyapp";

//PARSER
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


//RUN APP IF MONGO CONNECTED
mongoose.connect(MONGO_URL, (err) => {
    if (err) {
        console.log("Mongo connect: ", err);
    } else {
        app.listen(PORT, ()=>{
            console.log("App listening in port ", PORT);
        });
    }
});

