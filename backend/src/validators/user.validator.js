import Joi from 'joi';

/**
 * @openapi
 * components:
 *   parameters:
 *     username:
 *       name: username
 *       in: path
 *       description: Username of the user
 *       required: true
 *       schema:
 *         type: string
 *         minLength: 3
 *         maxLength: 20
 */
export const userIdentifierSchema = Joi.object({
    username: Joi.string().required().min(3).max(20)
});
