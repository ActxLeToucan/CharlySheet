import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier
 *         username:
 *           type: string
 *           description: Username of the user
 *           minLength: 3
 *           maxLength: 20
 *         email:
 *           type: string
 *           description: Email of the user
 *           minLength: 3
 *           maxLength: 64
 *           format: email
 *         role:
 *           type: string
 *           description: Role of the user
 *           enum: [user, admin]
 *           default: user
 *         createdAt:
 *           type: string
 *           description: Date of creation
 *           format: date-time
 */
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
        maxlength: 64
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

schema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

schema.plugin(uniqueValidator);

/**
 * @type {import('mongoose').Model}
 */
export default model('User', schema);
