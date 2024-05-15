import mongoose from 'mongoose';
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
};

const schemaOpts = {
    timestamps: true
};

const postSchema = new Schema(schemaObj, schemaOpts);

export default mongoose.model('Post', postSchema);