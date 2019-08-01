const router = require('express').Router();
const User = require('./../../model/user.model');
const tokenCheck = require('./../../helper/authenticate.middleware');
const jsonResponse = require('./../../helper/json-response.helper');
const QuestionPayload = require('./../../model/questionPayload.model').model;
const Question = require('./../../model/question.model').model;
const Survey = require('./../../model/survey.model');
const Result = require('./../../model/result.model');
const mongoose = require('mongoose');

router.use(tokenCheck);

router.post('/count-result', (req, res)=>{
    Result.find({idSurvey: mongoose.Types.ObjectId(req.body.idSurvey)}, (err, rs)=>{
        if (err) {
            res.json(jsonResponse(false, "Cannot connect to database"), {});
        } else {
            if (rs) {
                res.json(jsonResponse(true, "successfully", {count: rs.length}));
            } else {
                res.json(jsonResponse(true, "no result found", {count: 0}));
            }
        }
    });
});

router.post('/list-survey', (req, res)=>{
    Survey.find({idUser: mongoose.Types.ObjectId(req.body.idUser)}, (err, rs)=>{
        if (err) {
            res.json(jsonResponse(false, "Cannot connect to database"), {});
        } else {
            if (rs) {
                res.json(jsonResponse(true, "successfully", {surveys: rs}));
            } else {
                res.json(jsonResponse(true, "no survey found", {surveys: []}));
            }
        }
    });
});

router.post('/get', (req, res)=>{
    
});

router.post('/publish', (req, res)=>{
    let bodyQuestions = req.body.questions;
    let n = bodyQuestions.length;
    let questions = [];
    for (let i = 0; i < n; i++) {
        let qPayload = new QuestionPayload(bodyQuestions[i].payload);
        let question = new Question({
            type: bodyQuestions[i].type,
            payload: qPayload
        });
        questions.push(question);
    }
    let survey = new Survey({
       idUser: req.body.idUser,
       name: req.body.name,
       questions: questions
    });
    survey.save((err,rs)=>{
        if (err) {
            res.json(jsonResponse(false, "Save survey error", {}));
        } else {
            res.json(jsonResponse(true, "Successfully save survey", rs));
        }
    });

});


module.exports = router;