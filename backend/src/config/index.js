export const {
    /**
     * @type {string}
     */
    NODE_ENV,
    /**
     * @type {string}
     */
    PORT,
    /**
     * @type {string | undefined}
     */
    ORIGIN
} = process.env;

export const LOG_DIR = process.env.LOG_DIR || '/logs';
export const LOG_FORMAT = process.env.LOG_FORMAT || 'combined';
