import { Router } from 'express';
import passport from 'passport';

import SheetController from '../../controllers/sheet.controller.js';
import validate from '../../middlewares/validator.middleware.js';
import {
    sheetIdentifierSchema,
    sheetSchema
} from '../../validators/sheet.validator.js';

class RouterSheets {
    path = '/sheets';
    router = Router();
    tag = {
        name: 'Sheets',
        description: 'Sheets routes'
    };

    #controller = new SheetController();

    constructor() {
        this.#initializeRoutes();
    }

    #initializeRoutes() {
        /**
         * @openapi
         * /v1/sheets:
         *   get:
         *     summary: Get all sheets
         *     tags:
         *       - Sheets
         *     responses:
         *       '200':
         *         description: All sheets
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 items:
         *                   type: array
         *                   items:
         *                     type: object
         *                     properties:
         *                       name:
         *                         type: string
         *             example:
         *               items:
         *                 - name: Feuille 1
         */
        this.router.get(`${this.path}`, this.#controller.getAll);

        /**
         * @openapi
         * /v1/sheets:
         *   post:
         *     summary: Create a new sheet
         *     security:
         *      - bearerAuth: []
         *     tags:
         *       - Sheets
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *             required:
         *               - name
         *     responses:
         *       '200':
         *         description: The created sheet
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 id:
         *                   type: string
         *                 name:
         *                   type: string
         *                 users:
         *                   type: array
         *                   items:
         *                     type: object
         *                 createdAt:
         *                   type: string
         *               example:
         *                 id: 60f9a5f9d3f9f20015c1d7a8
         *                 name: Feuille 1
         *                 users: []
         *                 createdAt: 2021-07-23T13:53:05.000Z
         */
        this.router.post(
            `${this.path}`,
            passport.authenticate('jwt', { session: false }),
            validate(sheetSchema),
            this.#controller.post
        );

        /**
         * @openapi
         * /v1/sheets/{id}:
         *   get:
         *     summary: Get a sheet by ID
         *     tags: [Sheets]
         *     parameters:
         *       - $ref: '#/components/parameters/id'
         *     responses:
         *       200:
         *         description: The sheet
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 id:
         *                   type: string
         *                 name:
         *                   type: string
         *                 users:
         *                   type: array
         *                   items:
         *                    type: object
         *                 createdAt:
         *                   type: string
         *             example:
         *               id: 60f9a5f9d3f9f20015c1d7a8
         *               name: Feuille 1
         *               users: []
         *               createdAt: 2021-07-23T13:53:05.000Z
         *       404:
         *         description: Sheet not found
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 statusCode:
         *                   type: number
         *                 message:
         *                   type: string
         *                 error:
         *                   type: string
         *             example:
         *               statusCode: 404
         *               message: Sheet not found
         *               error: Sheet not found
         */
        this.router.get(
            `${this.path}/:id`,
            validate(sheetIdentifierSchema),
            this.#controller.getById
        );
    }
}

export default RouterSheets;
