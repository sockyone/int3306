const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let questionSchema = require('./question.model').schema;

const surveySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    idUser: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    questions: {
        type: [questionSchema],
        default: []
    }
});

const SurveyModel = mongoose.model('Survey', surveySchema);

module.exports = SurveyModel;