import passport from 'passport';

import { HttpException } from '../exceptions/HttpException.js';

/**
 * @param error {HttpException}
 * @param req {import('express').Request}
 * @param res {import('express').Response}
 * @param next {import('express').NextFunction}
 */
const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) throw new HttpException(401, info.message);
        req.user = user;
        next();
    })(req, res, next);
};

export default authenticateJWT;
