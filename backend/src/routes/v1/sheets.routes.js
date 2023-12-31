import { Router } from 'express';
import multer from 'multer';

import { COOLDOWN_SHEET_CREATION } from '../../config/index.js';
import SheetController from '../../controllers/sheet.controller.js';
import authenticateJWT from '../../middlewares/authenticateJWT.middleware.js';
import cool from '../../middlewares/cooldown.middleware.js';
import validate from '../../middlewares/validator.middleware.js';
import { sheetIdandUserIdSchema, sheetIdentifierSchema, sheetSchema } from '../../validators/sheet.validator.js';
import { arrayOfUserIdsSchema } from '../../validators/user.validator.js';

class RouterSheets {
    path = '/sheets';
    router = Router();
    tag = {
        name: 'Sheets',
        description: 'Sheets routes'
    };

    #controller = new SheetController();

    #uploads = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024 // 5 MB
        }
    });

    constructor() {
        this.#initializeRoutes();
    }

    #initializeRoutes() {
        /**
         * @openapi
         * /v1/sheets/me:
         *   get:
         *     tags:
         *       - Sheets
         *     summary: Get current user's sheets
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Current user's sheets
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Sheet'
         *       401:
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         */
        this.router.get(
            `${this.path}/me`,
            authenticateJWT,
            this.#controller.getMySheets
        );

        /**
         * @openapi
         * /v1/sheets/me/shared:
         *   get:
         *     tags:
         *       - Sheets
         *     summary: Get current user's shared sheets
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Current user's shared sheets
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Sheet'
         *       401:
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         */
        this.router.get(
            `${this.path}/me/shared`,
            authenticateJWT,
            this.#controller.getSharedSheets
        );

        /**
         * @openapi
         * /v1/sheets/me/recents:
         *   get:
         *     tags:
         *       - Sheets
         *     summary: Get current user's recent sheets
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Current user's recent sheets
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Sheet'
         *       401:
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '404':
         *         description: User not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         */
        this.router.get(
            `${this.path}/me/recents`,
            authenticateJWT,
            this.#controller.getRecentsSheets
        );

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
         *       $ref: '#/components/requestBodies/sheetSchema'
         *     responses:
         *       '200':
         *         description: The created sheet
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Sheet'
         *       '401':
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '404':
         *         description: User not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       422:
         *         $ref: '#/components/responses/errorValidate'
         *       '429':
         *         description: Too Many Requests
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         */
        this.router.post(
            `${this.path}`,
            authenticateJWT,
            validate(sheetSchema),
            cool(COOLDOWN_SHEET_CREATION, 'createSheet'),
            this.#controller.createSheet
        );

        /**
         * @openapi
         * /v1/sheets/import:
         *   post:
         *     summary: Import a sheet
         *     security:
         *     - bearerAuth: []
         *     tags:
         *     - Sheets
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               file:
         *                 type: string
         *     responses:
         *       200:
         *         description: The imported sheet
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Sheet'
         *       401:
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       404:
         *         description: User not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         */
        this.router.post(
            `${this.path}/import`,
            authenticateJWT,
            this.#uploads.single('file'),
            this.#controller.importSheet
        );

        /**
         * @openapi
         * /v1/sheets/{id}/name:
         *   put:
         *     summary: Change the name of a sheet
         *     security:
         *       - bearerAuth: []
         *     tags:
         *       - Sheets
         *     parameters:
         *       - $ref: '#/components/parameters/sheetId'
         *     requestBody:
         *       $ref: '#/components/requestBodies/sheetSchema'
         *     responses:
         *       '200':
         *         description: The updated sheet
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Sheet'
         *       '401':
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '403':
         *         description: Forbidden
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '404':
         *         description: Sheet not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       422:
         *         $ref: '#/components/responses/errorValidate'
         */
        this.router.put(
            `${this.path}/:id/name`,
            authenticateJWT,
            validate(sheetIdentifierSchema),
            validate(sheetSchema),
            this.#controller.changeName
        );

        /**
         * @openapi
         * /v1/sheets/{id}:
         *   get:
         *     summary: Get a sheet by ID
         *     security:
         *      - bearerAuth: []
         *     tags: [Sheets]
         *     parameters:
         *       - $ref: '#/components/parameters/sheetId'
         *     responses:
         *       200:
         *         description: The sheet
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/SheetUsersPopulated'
         *       404:
         *         description: Sheet not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '422':
         *         $ref: '#/components/responses/errorValidate'
         */
        this.router.get(
            `${this.path}/:id`,
            authenticateJWT,
            validate(sheetIdentifierSchema),
            this.#controller.getById
        );

        /**
         * @openapi
         * /v1/sheets/{id}:
         *   delete:
         *     summary: Delete a sheet by ID
         *     security:
         *       - bearerAuth: []
         *     tags: [Sheets]
         *     parameters:
         *       - $ref: '#/components/parameters/sheetId'
         *     responses:
         *       '204':
         *         description: Sheet deleted
         *       '401':
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '403':
         *         description: Forbidden
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '404':
         *         description: Sheet not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '422':
         *         $ref: '#/components/responses/errorValidate'
         */
        this.router.delete(
            `${this.path}/:id`,
            authenticateJWT,
            validate(sheetIdentifierSchema),
            this.#controller.deleteById
        );

        /**
         * @openapi
         * /v1/sheets/{id}/users:
         *   post:
         *     summary: Add users to a sheet
         *     security:
         *       - bearerAuth: []
         *     tags:
         *       - Sheets
         *     parameters:
         *       - $ref: '#/components/parameters/sheetId'
         *     requestBody:
         *       $ref: '#/components/requestBodies/arrayOfUserIds'
         *     responses:
         *       200:
         *         description: The users of the sheet after the addition
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/UserPublic'
         *       '401':
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       403:
         *         description: Forbidden
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       404:
         *         description: Sheet not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       422:
         *         $ref: '#/components/responses/errorValidate'
         */
        this.router.post(
            `${this.path}/:id/users`,
            authenticateJWT,
            validate(sheetIdentifierSchema),
            validate(arrayOfUserIdsSchema),
            this.#controller.addUsers
        );

        /**
         * @openapi
         * /v1/sheets/{id}/users/{userId}:
         *   delete:
         *     summary: Remove a user from a sheet
         *     security:
         *       - bearerAuth: []
         *     tags:
         *       - Sheets
         *     parameters:
         *       - $ref: '#/components/parameters/sheetId'
         *       - name: userId
         *         in: path
         *         required: true
         *         description: ID of the user to remove from the sheet
         *         schema:
         *           type: string
         *           minLength: 24
         *           maxLength: 24
         *     responses:
         *       200:
         *         description: The users of the sheet after the removal
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/UserPublic'
         *       '401':
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       403:
         *         description: Forbidden
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       404:
         *         description: Sheet or user not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '422':
         *         $ref: '#/components/responses/errorValidate'
         */
        this.router.delete(
            `${this.path}/:id/users/:userId`,
            authenticateJWT,
            validate(sheetIdandUserIdSchema),
            this.#controller.removeUser
        );

        /**
         * @openapi
         * /v1/sheets/{id}/export:
         *   get:
         *     summary: Export a sheet
         *     security:
         *     - bearerAuth: []
         *     tags:
         *     - Sheets
         *     parameters:
         *     - $ref: '#/components/parameters/sheetId'
         *     responses:
         *       200:
         *         description: The exported sheet
         *       '401':
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       403:
         *         description: Forbidden
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       404:
         *         description: Sheet not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       '422':
         *         $ref: '#/components/responses/errorValidate'
         */
        this.router.get(
            `${this.path}/:id/export`,
            authenticateJWT,
            validate(sheetIdentifierSchema),
            this.#controller.exportSheet
        );
    }
}

export default RouterSheets;
