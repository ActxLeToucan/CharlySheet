import nodeCache from 'node-cache';

import { HttpException } from '../exceptions/HttpException.js';

const cache = new nodeCache();

/**
 * @param duration {number} Durée du cooldown en secondes
 * @param action {string} Nom de l'action (clef du cache)
 * @returns {(function(Request, Response, NextFunction): void)}
 */
const cool = (duration, action) => (req, res, next) => {
    const { user } = req;
    if (!user) {
        throw new HttpException(
            401,
            'Unauthorized',
            'Unauthorized'
        );
    }
    
    const key = `${user._id}:${action}`;
    const cached = cache.get(key);
    if (cached) {
        throw new HttpException(
            429,
            'Too Many Requests',
            'Too Many Requests'
        );
    }
    
    cache.set(key, true, duration);
    next();
};

export default cool;
