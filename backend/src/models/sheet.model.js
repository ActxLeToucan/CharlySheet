import { model, Schema } from 'mongoose';

import User from './user.model.js';

/**
 * @openapi
 * components:
 *   schemas:
 *     Sheet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier
 *         name:
 *           type: string
 *           description: Name of the sheet
 *           minLength: 3
 *           maxLength: 30
 *         owner:
 *           type: string
 *           description: Owner of the sheet
 *         users:
 *           type: array
 *           description: Users of the sheet
 *           items:
 *            type: string
 *            format: ObjectId
 *         createdAt:
 *           type: string
 *           description: Date of creation
 *           format: date-time
 */
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
        delete ret.__v;
        return ret;
    }
});

/**
 * @type {import('mongoose').Model}
 */
export const Sheet = model('Sheet', schema);
