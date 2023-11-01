import { Router } from 'express';

import UserController from '../../controllers/user.controller.js';
import validate from '../../middlewares/validator.middleware.js';
import { newUserSchema, userIdentifierSchema } from '../../validators/user.validator.js';

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
         * /user/signup:
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
         *         description: Validation error
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         */
        this.router.post(`${this.path}/signup`,
            validate(newUserSchema),
            this.#controller.signup);

        /**
         * @openapi
         * /user/{username}:
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
         *         description: Validation error
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         */
        this.router.get(`${this.path}/:username`,
            validate(userIdentifierSchema),
            this.#controller.get);
    }
}

export default UserRoutes;
