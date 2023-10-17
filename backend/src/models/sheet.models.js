import { Schema, model } from 'mongoose';
import User from './user.models.js';

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: User
        }
    ]
});

/**
 * @type {import('mongoose').Model}
 */
export default model('Sheet', schema);
