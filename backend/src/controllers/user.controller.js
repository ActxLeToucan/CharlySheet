import jwt from 'jsonwebtoken';
import passport from 'passport';

import { EXPIRES_IN, JWT_SECRET } from '../config/index.js';
import { HttpException } from '../exceptions/HttpException.js';
import User from '../models/user.model.js';

class UserController {
    get = (req, res, next) => {
        const { id } = req.params;

        User.findOne({ _id: id }).select('-recents -email')
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
            if (await User.exists({ $or: [{ email }, { username }] })) {
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

    search = async (req, res, next) => {
        const { query } = req.params;

        try {
            const filter = [
                {
                    $and: [
                        { username: { $regex: query, $options: 'i' } },
                        { role: { $ne: 'admin' } } // prevent returning admin by searching username
                    ]
                }
            ];
            if (query.match(/^.+@.+$/)) {
                filter.push({
                    email: {
                        $regex: query,
                        $options: 'i'
                    }
                });
            }

            /**
             * @type {User[]}
             */
            let users = await User.find({
                $or: filter
            }).select('-recents');

            // prevent returning users from regex
            users = users.filter((user) =>
                user.username.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase())
            );

            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    };
}

export default UserController;
