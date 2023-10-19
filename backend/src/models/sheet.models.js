import { Schema, model } from 'mongoose';
import User from './user.models.js';

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false,
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
schema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

/**
 * @type {import('mongoose').Model}
 */
export const Sheet = model('Sheet', schema);
