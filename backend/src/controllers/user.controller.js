import jwt from 'jsonwebtoken';
import passport from 'passport';

import { EXPIRES_IN, JWT_SECRET } from '../config/index.js';
import { HttpException } from '../exceptions/HttpException.js';
import User from '../models/user.model.js';

class UserController {
    get = (req, res, next) => {
        const { username } = req.params;

        User.findOne({ username })
            .then((user) => {
                if (!user) {
                    throw new HttpException(
                        404,
                        'User not found',
                        'User not found'
                    );
                }

                res.status(200).json(user);
            })
            .catch(next);
    };

    signup = async (req, res, next) => {
        const { email, password, username } = req.body;

        try {
            if (
                (await User.find({
                    $or: [{ email }, { username }]
                }).count()) > 0
            ) {
                throw new HttpException(
                    409,
                    'User already exists',
                    'User already exists'
                );
            }
            const user = await User.register(
                new User({ email, username }),
                password
            );
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    success: true,
                    status: 'Registration Successful!',
                    user: user.toJSON()
                });
            });
        } catch (error) {
            next(error);
        }
    };

    me = async (req, res, next) => {
        try {
            const { user } = req;
            const dbUser = await User.findById(user._id);
            if (!dbUser) {
                throw new HttpException(
                    404,
                    'User not found',
                    'User not found'
                );
            }
            res.status(200).json(dbUser);
        } catch (error) {
            next(error);
        }
    };

    login = (req, res, next) => {
        passport.authenticate(
            'local',
            { session: false },
            (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(new HttpException(401, info.message));
                }
                try {
                    const token = jwt.sign(
                        { _id: user._id, role: user.role },
                        JWT_SECRET,
                        {
                            expiresIn: EXPIRES_IN
                        }
                    );
                    res.status(200).json({
                        success: true,
                        token: `Bearer ${token}`
                    });
                } catch (error) {
                    next(error);
                }
            }
        )(req, res, next);
    };
}

export default UserController;
