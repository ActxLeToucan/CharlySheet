/**
 * @openapi
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: integer
 *             message:
 *               type: string
 */

import { NODE_ENV } from '../config/index.js';
import { logger } from '../utils/logger.js';

const GENERIC_ERROR_MESSAGE = 'Something went wrong';

/**
 * @param error {HttpException}
 * @param req {import('express').Request}
 * @param res {import('express').Response}
 * @param next {import('express').NextFunction}
 */
const errorMiddleware = (error, req, res, next) => {
    try {
        const status = error.status ?? 500;
        const message = error.message ?? GENERIC_ERROR_MESSAGE;
        const publicMessage = error.publicMessage ?? GENERIC_ERROR_MESSAGE;

        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        res.status(status).json({
            error: {
                code: status,
                message: NODE_ENV === 'development' ? message : publicMessage
            }
        });
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
