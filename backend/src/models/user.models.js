import { Schema, model } from 'mongoose';

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * @type {import('mongoose').Model}
 */
export default model('User', schema);
