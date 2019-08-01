const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require("config");
let authRoute = require('./server/route/authentication/authentication.route');
let surveyRoute = require('./server/route/survey/survey.route');


const app = express();

let PORT = process.env.PORT || config.get("server.port") || 3000;
let MONGO_URL = process.env.MONGO_URL || config.get("mongo.url") || "mongodb://localhost:27017/surveyapp";

//PARSER
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/auth', authRoute);
app.use('/survey', surveyRoute);

//RUN APP IF MONGO CONNECTED
mongoose.connect(MONGO_URL, {useNewUrlParser: true}, (err) => {
    if (err) {
        console.log("Mongo connect: ", err);
    } else {
        app.listen(PORT, ()=>{
            console.log("App listening in port ", PORT);
        });
    }
});

