const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const answerSchema = require('./answer.model').schema;

const resultSchema = new Schema({
    idSurvey: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    idUser: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    answers: {
        type: [answerSchema],
        default: []
    }
});

const ResultModel = mongoose.model('Result', resultSchema);

module.exports = ResultModel;