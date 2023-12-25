import validateEnv from '../utils/envValidator.js';

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
     * @type {string}
     */
    ORIGIN,
    /**
     * @type {string}
     */
    MONGO_URI,
    /**
     * @type {string}
     */
    LOG_DIR,
    /**
     * @type {string}
     */
    LOG_FORMAT,
    /**
     * @type {string}
     */
    JWT_SECRET,
    /**
     * @type {string}
     */
    EXPIRES_IN,
    /**
     * @type {number}
     */
    COOLDOWN_SHEET_CREATION
} = validateEnv();
