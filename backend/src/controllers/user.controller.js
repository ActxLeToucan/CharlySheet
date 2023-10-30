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
}

export default UserController;
