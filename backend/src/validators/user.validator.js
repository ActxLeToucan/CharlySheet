import Joi from 'joi';

/**
 * @openapi
 * components:
 *   parameters:
 *     userIdentifier:
 *       name: id
 *       in: path
 *       description: Unique identifier of the user
 *       required: true
 *       schema:
 *         type: string
 *         minLength: 24
 *         maxLength: 24
 */
export const userIdentifierSchema = {
    joiSchema: Joi.object({
        id: Joi.string().required().length(24)
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

/**
 * @openapi
 * components:
 *   requestBodies:
 *      modifyUser:
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
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 64
 *                 description: Email of the user
 */
export const modifyUserSchema = {
    joiSchema: Joi.object({
        username: Joi.string().min(3).max(20),
        email: Joi.string().email().min(3).max(64)
    }),
    location: 'body'
};

/**
 * @openapi
 * components:
 *   requestBodies:
 *     modifyPassword:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldpassword:
 *                 type: string
 *                 minLength: 8
 *                 description: Old password of the user
 *               newpassword:
 *                 type: string
 *                 minLength: 8
 *                 description: New password of the user
 */
export const modifyPasswordSchema = {
    joiSchema: Joi.object({
        oldpassword: Joi.string().required().min(8),
        newpassword: Joi.string().required().min(8)
    }),
    location: 'body'
};


/**
 * @openapi
 * components:
 *   parameters:
 *     userSearch:
 *       name: query
 *       in: path
 *       description: Search query
 *       required: true
 *       schema:
 *         type: string
 *         minLength: 3
 */
export const userSearchSchema = {
    joiSchema: Joi.object({
        query: Joi.string().required().min(3)
    }),
    location: 'params'
};
