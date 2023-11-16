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
export const userIdentifierSchema = {
    joiSchema: Joi.object({
        username: Joi.string().required().min(3).max(20)
    }),
    location: 'params'
};

/**
 * @openapi
 * components:
 *   requestBodies:
 *     newUser:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 description: Username of the user
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Password of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 64
 *                 description: Email of the user
 */
export const newUserSchema = {
    joiSchema: Joi.object({
        username: Joi.string().required().min(3).max(20),
        password: Joi.string().required().min(8),
        email: Joi.string().required().email().min(3).max(64)
    }),
    location: 'body'
};

/**
 * @openapi
 * components:
 *  requestBodies:
 *    arrayOfUserIds:
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: string
 *              minLength: 24
 *              maxLength: 24
 */
export const arrayOfUserIdsSchema = {
    joiSchema: Joi.array().items(Joi.string().required().length(24)),
    location: 'body'
};

/**
 * @openapi
 * components:
 *   requestBodies:
 *     login:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 description: Username of the user
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Password of the user
 */
export const loginSchema = {
    joiSchema: Joi.object({
        username: Joi.string().required().min(3).max(20),
        password: Joi.string().required().min(8)
    }),
    location: 'body'
};
