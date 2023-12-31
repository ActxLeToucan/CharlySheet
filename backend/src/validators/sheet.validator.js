import Joi from 'joi';

/**
 * @openapi
 * components:
 *   parameters:
 *     sheetId:
 *       name: id
 *       in: path
 *       description: Id of the sheet
 *       required: true
 *       schema:
 *         type: string
 *         minLength: 24
 *         maxLength: 24
 */
export const sheetIdentifierSchema = {
    joiSchema: Joi.object({
        id: Joi.string().required().length(24)
    }),
    location: 'params'
};

/**
 * @openapi
 * components:
 *   requestBodies:
 *     sheetSchema:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 description: Name of the sheet
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 */
export const sheetSchema = {
    joiSchema: Joi.object({
        name: Joi.string().required().min(3).max(30)
    }),
    location: 'body'
};

export const sheetIdandUserIdSchema = {
    joiSchema: sheetIdentifierSchema.joiSchema.keys({
        userId: Joi.string().required().length(24)
    }),
    location: 'params'
};
