import { HttpException } from '../exceptions/HttpException.js';
import { Sheet } from '../models/sheet.model.js';
import User from '../models/user.model.js';

class SheetController {
    getById = async (req, res, next) => {
        const { id } = req.params;
        const { user } = req;
        try {
            const sheet = await Sheet.findOne({ _id: id })
                .populate('users', '-recents')
                .populate('owner');
            if (!sheet) {
                throw new HttpException(
                    404,
                    'Sheet not found',
                    'Sheet not found'
                );
            }
            if (
                // if the user is not the owner of the sheet and is not a user of the sheet
                sheet.owner._id.toString() !== user._id.toString() &&
                !sheet.users.some(
                    (u) => u._id.toString() === user._id.toString()
                )
            ) {
                throw new HttpException(
                    403,
                    'You do not have access to this sheet',
                    'You do not have access to this sheet'
                );
            }
            res.json(sheet.toJSON());
            res.end();
            // add the sheet to the user recents in background, like it was a 10 circular buffer
            const dbUser = await User.findById(user._id);
            if (dbUser) {
                // remove the sheet from the recents if it is already in
                dbUser.recents = dbUser.recents.filter(
                    (s) => s.toString() !== sheet._id.toString()
                );
                // add the sheet to the beginning of the recents
                dbUser.recents.unshift(sheet._id);
                // keep only the 10 first recents
                dbUser.recents = dbUser.recents.slice(0, 10);
                await dbUser.save();
            }
        } catch (error) {
            next(error);
        }
    };
    deleteById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { user } = req;
            const sheet = await Sheet.findOne({ _id: id });
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
                    'You are not the owner of this sheet',
                    'You are not the owner of this sheet'
                );
            }
            await sheet.deleteOne();
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    };
    getMySheets = async (req, res, next) => {
        try {
            const { user } = req;
            const sheets = await Sheet.find({ owner: user._id });
            res.status(200).json(sheets);
        } catch (error) {
            next(error);
        }
    };
    getSharedSheets = async (req, res, next) => {
        try {
            const { user } = req;
            const sharedSheets = await Sheet.find({ users: user._id });
            res.json(sharedSheets);
        } catch (error) {
            next(error);
        }
    };
    getRecentsSheets = async (req, res, next) => {
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
            await dbUser.populate('recents');
            res.json(dbUser.recents);
        } catch (error) {
            next(error);
        }
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
                    'You are not the owner of this sheet',
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
                    'You are not the owner of this sheet',
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
            await sheet.populate('users', '-recents');
            await sheet.populate('owner', '-recents');
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
                .populate('users', '-recents')
                .populate('owner', '-recents');
            res.json(updatedSheet.users);
        } catch (error) {
            next(error);
        }
    };
}

export default SheetController;
