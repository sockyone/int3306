const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    
});

const QuestionModel = mongoose.model('Question', questionSchema);

module.exports = QuestionModel;