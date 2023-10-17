import { Router } from 'express';

class RouterSheets {
    router = Router();

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
        this.router.get('/', (req, res) => {
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
    }
}

export default RouterSheets;
