const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaObj = {
    title: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        required: true
    }
};

const schemaOpts = {
    timestamps: true
};

const postSchema = new Schema(schemaObj, schemaOpts);

module.exports = mongoose.model('Post', postSchema);