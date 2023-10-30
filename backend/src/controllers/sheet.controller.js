import { HttpException } from '../exceptions/HttpException.js';
import { Sheet } from '../models/sheet.model.js';

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
            await sheet.save();
        } catch (error) {
            next(new HttpException(409, error.message, 'Can\'t create sheet'));
        }
        res.json(sheet.toJSON());
    };
}

export default SheetController;
