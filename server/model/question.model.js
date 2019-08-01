const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionPayload = require('./questionPayload.model');

const questionSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    payload: {
        type: questionPayload
    }

});

const QuestionModel = mongoose.model('Question', questionSchema);

module.exports = {
    model: QuestionModel,
    schema: questionSchema
};