import { HttpException } from '../exceptions/HttpException.js';
import { Sheet } from '../models/sheet.model.js';
import User from '../models/user.model.js';

class SheetController {
    getById = async (req, res, next) => {
        const { id } = req.params;

        Sheet.findOne({ _id: id })
            .then((sheet) => {
                if (!sheet) {
                    throw new HttpException(
                        404,
                        'Sheet not found',
                        'Sheet not found'
                    );
                }

                res.status(200).json(sheet);
            })
            .catch(next);
    };
    getAll = async (req, res, next) => {
        Sheet.find()
            .then((sheets) => {
                res.status(200).json(sheets);
            })
            .catch(next);
    };
    post = async (req, res, next) => {
        const { name } = req.body;
        /**
         * @type {import('../../models/sheet.model.js').Sheet}
         */
        const sheet = new Sheet({ name });
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
            sheet.owner = dbUser._id;
            await sheet.save();
            await sheet.populate('owner');
            res.json(sheet.toJSON());
        } catch (error) {
            next(error);
        }
    };
}

export default SheetController;
