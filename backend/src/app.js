import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { createServer } from 'http';
import { connect } from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Server } from 'socket.io';

import { JWT_SECRET, LOG_FORMAT, MONGO_URI, NODE_ENV, ORIGIN, PORT } from './config/index.js';
import { HttpException } from './exceptions/HttpException.js';
import SocketIOEventHandlers from './handlers/SocketIOEventHandlers.js';
import errorMiddleware from './middlewares/error.middleware.js';
import userModel from './models/user.model.js';
import HealthcheckRoutes from './routes/healthcheck.routes.js';
import RouterV1 from './routes/v1/index.js';
import { logger, stream } from './utils/logger.js';

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
    }

    /**
     * Initialise l'ensemble de l'application
     */
    async initialize() {
        logger.info('Initializing application...');
        this.#initializeMiddlewares();
        this.#initializeRoutes();
        this.#initializeErrorHandling();
        this.#initializeSocketEvents();
        await this.#initializeMongoDB();
        this.#initializePassport();
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

        // Redirection vers la documentation de la dernière version de l'API
        this.app.get('/', (_, res) => res.redirect('/v1/docs'));

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

    /**
     * Initialise la stratégie d'authentification JWT via Passport
     */
    #initializePassport() {
        // stratégie d'authentification locale : username + password -> token
        passport.use(userModel.createStrategy());
        passport.serializeUser(userModel.serializeUser());
        passport.deserializeUser(userModel.deserializeUser());
        const options = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET
        };
        // stratégie d'authentification JWT qui vérifie la validité du token

        /**
         * @openapi
         * components:
         *   securitySchemes:
         *     bearerAuth:
         *       type: http
         *       scheme: bearer
         *       bearerFormat: JWT
         */
        passport.use(
            new JwtStrategy(options, (jwtPayload, done) => {
                if (jwtPayload) {
                    return done(null, jwtPayload);
                }
                return done(null, false);
            })
        );
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
