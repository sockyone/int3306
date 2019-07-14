const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema({
    
});

const SurveyModel = mongoose.model('Survey', surveySchema);

module.exports = SurveyModel;