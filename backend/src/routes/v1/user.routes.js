import { Router } from 'express';

import UserController from '../../controllers/user.controller.js';
import authenticateJWT from '../../middlewares/authenticateJWT.middleware.js';
import validate from '../../middlewares/validator.middleware.js';
import {
    loginSchema,
    newUserSchema,
    userIdentifierSchema
} from '../../validators/user.validator.js';

class UserRoutes {
    path = '/user';
    router = Router();
    tag = {
        name: 'User',
        description: 'User routes'
    };

    #controller = new UserController();

    constructor() {
        this.#initializeRoutes();
    }

    #initializeRoutes() {
        /**
         * @openapi
         * /v1/user/signup:
         *   post:
         *     tags:
         *     - User
         *     summary: Signup
         *     requestBody:
         *       $ref: '#/components/requestBodies/newUser'
         *     responses:
         *       201:
         *         description: User created
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/User'
         *       409:
         *         description: Username or email already exists
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       422:
         *         $ref: '#/components/responses/errorValidate'
         */
        this.router.post(
            `${this.path}/signup`,
            validate(newUserSchema),
            this.#controller.signup
        );

        /**
         * @openapi
         * /v1/user/me:
         *   get:
         *     tags:
         *       - User
         *     summary: Get current user
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       '200':
         *         description: Current user
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/User'
         */
        this.router.get(
            `${this.path}/me`,
            authenticateJWT,
            this.#controller.me
        );

        /**
         * @openapi
         * /v1/user/login:
         *   post:
         *     tags:
         *       - User
         *     summary: Login
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *               password:
         *                 type: string
         *             required:
         *               - username
         *               - password
         *     responses:
         *       '200':
         *         description: Login successful
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         *                 token:
         *                   type: string
         *             example:
         *               success: true
         *               token: Bearer JWT_TOKEN
         *       '401':
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '422':
         *         $ref: '#/components/responses/errorValidate'
         */
        this.router.post(
            `${this.path}/login`,
            validate(loginSchema),
            this.#controller.login
        );

        /**
         * @openapi
         * /v1/user/{username}:
         *   get:
         *     tags:
         *     - User
         *     summary: Get user
         *     parameters:
         *     - $ref: '#/components/parameters/username'
         *     responses:
         *       200:
         *         description: User
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/User'
         *       404:
         *         description: User not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       422:
         *         $ref: '#/components/responses/errorValidate'
         */
        this.router.get(
            `${this.path}/:username`,
            validate(userIdentifierSchema),
            this.#controller.get
        );
    }
}

export default UserRoutes;
