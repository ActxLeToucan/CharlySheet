import { model, Schema } from 'mongoose';

import User from './user.model.js';

/**
 * @openapi
 * components:
 *  schemas:
 *   Cell:
 *    type: object
 *    properties:
 *     x:
 *      type: number
 *      description: X coordinate of the cell
 *     y:
 *      type: number
 *      description: Y coordinate of the cell
 *     formula:
 *      type: string
 *      description: Formula of the cell
 *     style:
 *      type: object
 *      description: Style of the cell
 */
const cellSchema = new Schema({
    x: Number,
    y: Number,
    formula: String,
    style: Schema.Types.Mixed
});

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
 *           $ref: '#/components/schemas/UserPublic'
 *           description: Owner of the sheet
 *         users:
 *           type: array
 *           description: Users of the sheet
 *           items:
 *             type: string
 *             format: ObjectId
 *         createdAt:
 *           type: string
 *           description: Date of creation
 *           format: date-time
 *         cells:
 *           type: array
 *           description: Cells of the sheet
 *           items:
 *             $ref: '#/components/schemas/Cell'
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
    ],
    cells: [cellSchema]
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

/**
 * @openapi
 * components:
 *   schemas:
 *     SheetUsersPopulated:
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
 *           $ref: '#/components/schemas/UserPublic'
 *           description: Owner of the sheet
 *         users:
 *           type: array
 *           description: Users of the sheet
 *           items:
 *            $ref: '#/components/schemas/UserPublic'
 *         createdAt:
 *           type: string
 *           description: Date of creation
 *           format: date-time
 *         cells:
 *           type: array
 *           description: Cells of the sheet
 *           items:
 *             $ref: '#/components/schemas/Cell'
 */
