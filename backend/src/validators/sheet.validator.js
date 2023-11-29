import Joi from 'joi';

/**
 * @openapi
 * components:
 *   parameters:
 *     id:
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
        id: Joi.string().required().min(24).max(24)
    }),
    location: 'params'
};

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
