import { Router } from 'express';

import DocsRoutes from '../docs.routes.js';
import RouterSheets from './sheets.routes.js';
import UserRoutes from './user.routes.js';

class RouterV1 {
    path = '/v1';
    router = Router();
    version = '1.0.0';

    constructor() {
        this.#initializeRoutes();
    }

    #initializeRoutes() {
        const sheetsRoutes = new RouterSheets();
        this.router.use(`${this.path}`, sheetsRoutes.router);

        const userRoutes = new UserRoutes();
        this.router.use(`${this.path}`, userRoutes.router);

        const tags = [
            userRoutes.tag,
            sheetsRoutes.tag
        ];

        this.router.use(
            `${this.path}`,
            new DocsRoutes(this.version, 'v1', tags).router
        );
    }
}

export default RouterV1;
