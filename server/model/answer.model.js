const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    payload: {
        type: String,
        required: true
    }
});

const answerModel = mongoose.model('Answer', answerSchema);

module.exports = {
    model: answerModel,
    schema: answerSchema
};