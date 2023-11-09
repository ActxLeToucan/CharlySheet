import { HttpException } from '../exceptions/HttpException.js';
import { Sheet } from '../models/sheet.model.js';
import User from '../models/user.model.js';

class SheetController {
    getById = async (req, res, next) => {
        const { id } = req.params;

        Sheet.findOne({ _id: id })
            .populate('users')
            .populate('owner')
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
    createSheet = async (req, res, next) => {
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
    changeName = async (req, res, next) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const sheet = await Sheet.findById(id);
            if (!sheet) {
                throw new HttpException(
                    404,
                    'Sheet not found',
                    'Sheet not found'
                );
            }
            // vérifier que l'utilisateur est bien le propriétaire de la feuille
            if (sheet.owner.toString() !== req.user._id.toString()) {
                throw new HttpException(
                    403,
                    'Forbidden',
                    'You are not the owner of this sheet'
                );
            }
            sheet.name = name;
            await sheet.save();
            await sheet.populate('owner');
            await sheet.populate('users');
            res.json(sheet.toJSON());
        } catch (error) {
            next(error);
        }
    };
    addUsers = async (req, res, next) => {
        const { id } = req.params;
        const { user } = req;
        const userIds = req.body;
        try {
            const sheet = await Sheet.findById(id);
            if (!sheet) {
                throw new HttpException(
                    404,
                    'Sheet not found',
                    'Sheet not found'
                );
            }
            if (sheet.owner.toString() !== user._id.toString()) {
                throw new HttpException(
                    403,
                    'Forbidden',
                    'You are not the owner of this sheet'
                );
            }
            const users = await User.find({ _id: { $in: userIds } });
            if (!users) {
                throw new HttpException(
                    404,
                    'User not found',
                    'User not found'
                );
            }
            // prevent duplicates users and prevent owner to be added in users
            const newUsers = users.filter(
                (user) =>
                    !sheet.users.includes(user._id) &&
                    user._id.toString() !== sheet.owner.toString()
            );
            sheet.users.push(...newUsers.map((user) => user._id));
            await sheet.save();
            await sheet.populate('users');
            await sheet.populate('owner');
            res.json(sheet.users);
        } catch (error) {
            next(error);
        }
    };
    removeUser = async (req, res, next) => {
        const { id, userId } = req.params;
        const { user } = req;
        try {
            const sheet = await Sheet.findById(id);
            if (!sheet) {
                throw new HttpException(
                    404,
                    'Sheet not found',
                    'Sheet not found'
                );
            }
            if (sheet.owner.toString() !== user._id.toString()) {
                throw new HttpException(
                    403,
                    'Forbidden',
                    'You are not the owner of this sheet'
                );
            }
            // Filtrer manuellement le tableau des utilisateurs pour retirer l'utilisateur
            sheet.users = sheet.users.filter((u) => u.toString() !== userId);

            // Enregistrer le document mis à jour
            await sheet.save();

            // Rechercher le document mis à jour pour la population
            const updatedSheet = await Sheet.findById(id)
                .populate('users')
                .populate('owner');
            res.json(updatedSheet.users);
        } catch (error) {
            next(error);
        }
    };
}

export default SheetController;
