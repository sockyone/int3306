const router = require('express').Router();
const User = require('./../../model/user.model');
const tokenCheck = require('./../../helper/authenticate.middleware');
const jsonResponse = require('./../../helper/json-response.helper');
const QuestionPayload = require('./../../model/questionPayload.model').model;
const Question = require('./../../model/question.model').model;
const Survey = require('./../../model/survey.model');
const Result = require('./../../model/result.model');
const Answer = require('./../../model/answer.model').model;
const mongoose = require('mongoose');

router.use(tokenCheck);

router.post('/count-result', (req, res)=>{
    Result.find({idSurvey: mongoose.Types.ObjectId(req.body.idSurvey)}, (err, rs)=>{
        if (err) {
            res.json(jsonResponse(false, err.message, {}));
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
            res.json(jsonResponse(false, err.message, {}));
        } else {
            if (rs) {
                res.json(jsonResponse(true, "successfully", {surveys: rs}));
            } else {
                res.json(jsonResponse(true, "no survey found", {surveys: []}));
            }
        }
    });
});

router.post('/get-survey', (req, res)=>{
    Survey.findById(mongoose.Types.ObjectId(req.body.idSurvey), (err, rs)=>{
        if (err) {
            res.json(jsonResponse(false, err.message, {}));
        } else {
            if (rs) {
                res.json(jsonResponse(true, "successfully", rs));
            } else {
                res.json(jsonResponse(true, "no survey found", {}));
            }
        }
    });
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
            res.json(jsonResponse(false, err.message, {}));
        } else {
            res.json(jsonResponse(true, "Successfully save survey", rs));
        }
    });
});

router.post('/submit-survey', (req, res)=>{
    let survey = new Result({
        idUser: mongoose.Types.ObjectId(req.body.idUser),
        idSurvey: mongoose.Types.ObjectId(req.body.idSurvey)
    });
    let n = req.body.answers.length;
    let answers = [];
    for (let i = 0; i < n; i++) {
        let answer = new Answer(req.body.answers[i]);
        answers.push(answer);
    }
    survey.answers = answers;
    survey.save((err, rs)=>{
        if (err) {
            res.json(jsonResponse(false, err.message, {}));
        } else {
            res.json(jsonResponse(true, "successfully", rs));
        }
    });
});

router.post('/delete-survey', (req, res)=>{
    Survey.findByIdAndDelete(mongoose.Types.ObjectId(req.body.idSurvey), (err, rs)=>{
        if (err) {
            res.json(jsonResponse(false, err.message, {}));
        } else {
            res.json(jsonResponse(true, "successfully", rs));
            Result.deleteMany({idSurvey: mongoose.Types.ObjectId(req.body.idSurvey)}, (err)=>{
                if (err) {
                    console.log(err);
                }
            });
        }
    });
});

router.post('/get-result', (req, res)=>{
    Result.find({idSurvey: mongoose.Types.ObjectId(req.body.idSurvey)}, (err, rs)=>{
        if (err) {
            res.json(jsonResponse(false, err.message, {}));
        } else {
            if (rs) {
                res.json(jsonResponse(true, "successfully", rs));
            } else {
                res.json(jsonResponse(true, "There is no result for this survey", []));
            }
        }
    });
});

router.post('/get-calculated-result', (req, res)=>{
    Result.find({idSurvey: mongoose.Types.ObjectId(req.body.idSurvey)}, (err, rs)=>{
        if (err) {
            res.json(jsonResponse(false, err.message, {}));
        } else {
            if (rs) {
                let n = rs.length;
                if (n <= 0) {
                    res.json(jsonResponse(true, "There is no result for this survey", {
                        survey: {},
                        answers: []
                    }));
                    return;
                }
                let calResult = {
                    answers: []
                };
                let nQuest = rs[0].answers.length;
                for (let i = 0; i < nQuest; i++) {
                    let arr = [];
                    for (let j = 0; j < n; j++) {
                        arr.push(rs[j].answers[i].payload);
                    }
                    calResult.answers.push(arr);
                }
                Survey.findById(mongoose.Types.ObjectId(req.body.idSurvey), (err,rs)=>{
                    if (err) {
                        res.json(jsonResponse(false, err.message, {}));
                    } else {
                        if (rs) {
                            calResult.survey = rs;
                            res.json(jsonResponse(true, "successfully", calResult));

                        } else {
                            res.json(jsonResponse(true, "There is no survey", {}));
                        }
                    }
                });
            } else {
                res.json(jsonResponse(true, "There is no result for this survey", []));
            }
        }
    });
});

router.post('/if-own-survey', (req, res)=>{
    Survey.findById(mongoose.Types.ObjectId(req.body.idSurvey), (err, rs)=>{
        if (err) {
            res.json(jsonResponse(false, err.message, {}));
        } else {
            if (rs) {
                if (rs.idUser.toString() === req.body.idUser.toString()) {
                    res.json(jsonResponse(true, "successfully", {check: true}));
                } else {
                    res.json(jsonResponse(true, "successfully", {check: false}));
                }
            } else {
                res.json(jsonResponse(false, "survey not found. invalid link", {}));
            }
        }
    });
});


module.exports = router;