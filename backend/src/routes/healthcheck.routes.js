import { Router } from 'express';

class HealthcheckRoutes {
    path = '/healthcheck';
    router = Router();

    constructor () {
        this.#initializeRoutes();
    }

    #initializeRoutes () {
        /**
         * @openapi
         * /healthcheck:
         *   get:
         *     summary: Get the healthcheck of the API
         *     responses:
         *       '200':
         *         description: The API is up and running
         *         content:
         *           text/plain:
         *             example: OK
         */
        this.router.get(`${this.path}`, (req, res) => res.sendStatus(200));
    }
}

export default HealthcheckRoutes;
