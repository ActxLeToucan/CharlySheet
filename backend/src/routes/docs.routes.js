import { Router } from 'express';
import SwaggerUI from 'swagger-ui-express';

import DocGenerator from '../utils/docGenerator.js';

class DocsRoutes {
    path = '/docs';
    router = Router();

    /**
     * @param version {string}
     * @param folder {string}
     * @param tags {Array.<{name: string, description: string}>|undefined}
     */
    constructor(version, folder, tags = []) {
        this.version = version;
        this.folder = folder;
        this.tags = tags;

        this.#initializeRoutes();
    }

    #initializeRoutes() {
        const documentation = DocGenerator(this.version, this.folder, this.tags);

        /**
         * @openapi
         * /{version}/docs:
         *   get:
         *     summary: Get the documentation of the API
         *     tags:
         *     - Documentation
         *     parameters:
         *     - in: path
         *       name: version
         *       description: The version of the API
         *       required: true
         *       schema:
         *         type: string
         *         enum: [v1]
         *         example: v1
         *     responses:
         *       200:
         *         description: Documentation as an HTML page
         */
        this.router.use(`${this.path}`, SwaggerUI.serve, SwaggerUI.setup(documentation, {
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: `API ${this.version} - Documentation`,
            customfavIcon: '/favicon.ico'
        }));

        /**
         * @openapi
         * /{version}/docs.json:
         *   get:
         *     summary: Get the documentation of the API (JSON)
         *     tags:
         *     - Documentation
         *     parameters:
         *     - in: path
         *       name: version
         *       description: The version of the API
         *       required: true
         *       schema:
         *         type: string
         *         enum: [v1]
         *         example: v1
         *     responses:
         *       200:
         *         description: Documentation as an OpenAPI JSON file
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         */
        this.router.get(`${this.path}.json`, (req, res) => res.json(documentation));
    }
}

export default DocsRoutes;
