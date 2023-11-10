import { Router } from 'express';

import { HttpException } from '../../exceptions/HttpException.js';
import { Sheet } from '../../models/sheet.model.js';

class RouterSheets {
    path = '/sheets';
    router = Router();
    tag = {
        name: 'Sheets',
        description: 'Sheets routes'
    };

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
         *       200:
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
         *         example: Feuille 1
         *
         */
        this.router.get(`${this.path}`, (req, res) => {
            res.json({
                items: [
                    {
                        name: 'Feuille 1'
                    },
                    {
                        name: 'Feuille 2'
                    },
                    {
                        name: 'Feuille 3'
                    }
                ]
            });
        });
        /**
         * @openapi
         * /v1/sheets:
         *   post:
         *     summary: Create a new sheet
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
         *       200:
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
         *                 createdAt:
         *                   type: string
         *               example:
         *                 id: 60f9a5f9d3f9f20015c1d7a8
         *                 name: Feuille 1
         *                 users: []
         *                 createdAt: 2021-07-23T13:53:05.000Z
         */
        this.router.post(`${this.path}`, async (req, res, next) => {
            const { name } = req.body;
            /**
             * @type {import('../../models/sheet.model.js').Sheet}
             */
            const sheet = new Sheet({ name });
            try {
                await sheet.save();
            } catch (error) {
                next(new HttpException(409, error.message, 'Can\'t create sheet'));
            }
            res.json(sheet.toJSON());
        });
    }
}

export default RouterSheets;
