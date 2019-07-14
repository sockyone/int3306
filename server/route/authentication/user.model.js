const Schema = require("mongoose").Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        minlength: [10, 'Name must have at least 10 character']
    } 
});