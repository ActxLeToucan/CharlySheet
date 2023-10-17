import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { connect } from 'mongoose';

import {
    LOG_FORMAT,
    NODE_ENV,
    ORIGIN,
    PORT,
    MONGO_URI
} from './config/index.js';
import { HttpException } from './exceptions/HttpException.js';
import errorMiddleware from './middlewares/error.middleware.js';
import { logger, stream } from './utils/logger.js';
import HealthcheckRoutes from './routes/healthcheck.routes.js';
import RouterV1 from './routes/v1/index.js';
import SocketIOEventHandlers from './handlers/SocketIOEventHandlers.js';

class App {
    /**
     * @type {express.Application}
     */
    app;
    /**
     * @type {string}
     */
    env;
    /**
     * @type {number | string}
     */
    port;
    /**
     * @type {Server}
     */
    io;
    /**
     * @type {import('http').Server}
     */
    server;

    constructor() {
        this.app = express();
        this.env = NODE_ENV;
        this.port = PORT;
        this.server = createServer(this.app);
        this.io = new Server(this.server, { cors: { origin: ORIGIN } });

        this.#initializeMiddlewares();
        this.#initializeRoutes();
        this.#initializeErrorHandling();
        this.#initializeSocketEvents();
        this.#initializeMongoDB();
    }

    /**
     * Initialise les middleware Express
     */
    #initializeMiddlewares() {
        // Log des requêtes entrantes
        this.app.use(morgan(LOG_FORMAT, { stream }));
        // Autorisation des cors
        this.app.use(cors({ origin: ORIGIN }));
        // Prévention des attaques polluantes
        this.app.use(hpp({}));
        // Plugin de sécurité pour Express
        this.app.use(helmet());
        // Compression des réponses
        this.app.use(compression());
        // indique à Express que l'on souhaite parser le body des requêtes en JSON
        this.app.use(express.json());
        // interdit les nested object dans le body des requêtes
        this.app.use(express.urlencoded({ extended: false }));
    }

    /**
     * Initialise les routes Express
     */
    #initializeRoutes() {
        // Health check: /healthcheck
        this.app.use('/', new HealthcheckRoutes().router);

        // V1 de l'API: /v1
        this.app.use('/', new RouterV1().router);

        // catch 404 and forward to error handler
        this.app.use((req, res, next) => {
            next(new HttpException(404, 'Route not found', 'Route not found'));
        });
    }
    /**
     * Initialise les évènements SocketIO
     */
    #initializeSocketEvents() {
        new SocketIOEventHandlers(this.io);
    }
    /**
     * Initialise la connexion à MongoDB
     */
    async #initializeMongoDB() {
        try {
            await connect(MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            logger.info('MongoDB connected');
        } catch (error) {
            logger.error('MongoDB connection error: ', error);
        }
    }

    /**
     * Initialise les gestionnaires d'erreurs Express
     */
    #initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    listen() {
        this.server.listen(this.port, () => {
            logger.info('=================================');
            logger.info(`======= ENV: ${this.env} =======`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info('=================================');
        });
    }
}

export default App;
