import bcrypt from 'bcryptjs';

import { PASSWORD_SALT } from '../config/index.js';
import { HttpException } from '../exceptions/HttpException.js';
import User from '../models/user.model.js';

class UserController {
    get = (req, res, next) => {
        const { username } = req.params;

        User.findOne({ username })
            .then(user => {
                if (!user) {
                    throw new HttpException(404, 'User not found', 'User not found');
                }

                res.status(200).json(user);
            }).catch(next);
    };

    signup = (req, res, next) => {
        const { email, password, username } = req.body;

        bcrypt.hashSync(password, PASSWORD_SALT).then(hash => {
            User.findOne({ $or: [{ email }, { username }] })
                .then(user => {
                    if (user) throw new HttpException(409, 'User already exists', 'User already exists');

                    User.create({ email, password: hash, username })
                        .then((user) => res.status(201).json(user)).catch(next);
                }).catch(next);
        }).catch(next);
    };
}

export default UserController;
