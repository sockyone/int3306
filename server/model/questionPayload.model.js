const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionPayloadSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    choices: {
        type: [String],
        default: []
    }
});

const QuestionPayloadModel = mongoose.model('QuestionPayload', questionPayloadSchema);

module.exports = {
    model: QuestionPayloadModel,
    schema: questionPayloadSchema
};