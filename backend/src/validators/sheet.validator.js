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
export const sheetIdentifierSchema = Joi.object({
    id: Joi.string().required().min(24).max(24)
});

export const sheetSchema = Joi.object({
    name: Joi.string().required().min(3).max(30)
});
