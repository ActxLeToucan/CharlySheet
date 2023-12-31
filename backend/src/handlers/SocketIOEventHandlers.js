import { Mutex } from 'async-mutex';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/index.js';
import { Sheet } from '../models/sheet.model.js';
import { logger } from '../utils/logger.js';

/**
 * @typedef {Object} Events
 * @property {string} ACQUIRE_CELL - event fired by client when he wants to acquire a cell
 * @property {string} RELEASE_CELL - event fired by client when he wants to release a cell
 * @property {string} CELL_ACQUIRED - event fired by server when a client acquired a cell
 * @property {string} CELL_HOLDED - event fired by server after a client tried to acquire a cell and it was already acquired
 * @property {string} CELL_RELEASED - event fired by server when a client released a cell
 * @property {string} SELECT_CELL - event fired by client when he wants to select a cell
 * @property {string} CELL_SELECTED - event fired by server when a client selected a cell
 * @property {string} CHANGE_CELL - event fired by client when he wants to change a cell
 * @property {string} CELL_CHANGED - event fired by server when a client changed a cell
 * @property {string} JOIN_ROOM - event fired by client when he wants to join a room
 * @property {string} ROOM_JOINED - event fired by server when a client joined a room
 * @property {string} LEAVE_ROOM - event fired by client when he wants to leave a room
 * @property {string} ROOM_LEAVED - event fired by server when a client leaved a room
 * @property {string} NEW_MESSAGE - event relayed by server when a client sent a message
 * @property {string} SHEET_SYNC - event fired by server when a client joined a room
 */

/** @type {Events} */
const Events = {
    ACQUIRE_CELL: 'acquireCell',
    RELEASE_CELL: 'releaseCell',
    CELL_ACQUIRED: 'cellAcquired',
    CELL_HOLDED: 'cellHolded',
    CELL_RELEASED: 'cellReleased',
    SELECT_CELL: 'selectCell',
    CELL_SELECTED: 'cellSelected',
    CHANGE_CELL: 'changeCell',
    CELL_CHANGED: 'cellChanged',
    JOIN_ROOM: 'joinRoom',
    ROOM_JOINED: 'roomJoined',
    LEAVE_ROOM: 'leaveRoom',
    ROOM_LEAVED: 'roomLeaved',
    NEW_MESSAGE: 'newMessage',
    SHEET_SYNC: 'sheetSync'
};

export default class SocketIOEventHandlers {
    /**
     * @type {Server}
     */
    io;

    /**
     *
     * @param {Server} io
     */
    constructor(io) {
        this.io = io;
        /**
         * On autorise seulement les connexions de nos utilisateurs
         * pour ne pas servir de relais gratuit
         */
        io.use((socket, next) => {
            const token =
                socket.handshake.auth.token?.split(' ')[1] ??
                socket.handshake.headers.authorization?.split(' ')[1];
            socket.handshake.auth.token = token;
            if (!token) return next(new Error('Missing JWT'));
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) return next(new Error('Invalid or expired JWT'));
                socket.decoded = decoded;
                next();
            });
        });

        io.on('connection', async (socket) => {
            socket.on('ping', () => {
                socket.emit('pong', { message: 'pong' });
            });
            socket.on('disconnect', () => {
                const room = socket.data.room;
                /**
                 * On vérifie que le socket a bien une room
                 * car il peut très bien avoir initié une connexion sans faire de join
                 */
                if (room) {
                    room.leave(socket);
                    RoomOrganizer.garbageCollect(io, room);
                }
            });
            // join room
            socket.on(Events.JOIN_ROOM, async (payload) => {
                const room = await RoomOrganizer.getRoom(payload.sheetId, io);
                await room.join(socket);
                /**
                 * Il se peut que la personne n'ait pas eu le droit de rejoindre la room
                 * et donc elle peut être vide
                 */
                RoomOrganizer.garbageCollect(io, room);
            });
        });
    }
}

class RoomOrganizer {
    /**
     * @type {Map<string, RoomSheet>}
     */
    static rooms = new Map();
    /**
     * @type {Mutex}
     */
    static mutex = new Mutex();

    /**
     * get a room or create it if it doesn't exist
     * @param {string} roomId
     * @param {Server} io
     * @returns {RoomSheet}
     * @memberof RoomOrganizer
     */
    static async getRoom(roomId, io) {
        /**
         * on ne perd du temps à faire une exclusion mutuelle que si la room n'existe pas
         */
        if (!this.rooms.has(roomId)) {
            await this.mutex.runExclusive(() => {
                /**
                 * on recheck si la room n'existe pas car elle peut avoir été créée entre temps
                 */
                if (!this.rooms.has(roomId)) {
                    this.rooms.set(roomId, new RoomSheet(roomId, io));
                }
            });
        }
        return this.rooms.get(roomId);
    }

    static async garbageCollect(io, room) {
        await this.mutex.runExclusive(() => {
            if (room.users.size === 0) {
                this.rooms.delete(room.sheetId);
            }
        });
    }
}

class RoomSheet {
    /**
     *
     * @param {String} sheetId
     * @param {Server} io
     */
    constructor(sheetId, io) {
        this.sheetId = sheetId;
        this.mutex = new Mutex();
        this.cellsHolder = new Map();
        this.io = io;
        this.users = new Map();
    }

    /**
     * @param {import('socket.io').Socket} socket
     */
    async join(socket) {
        const { _id } = socket.decoded;
        const sheet = await Sheet.findById(this.sheetId);
        if (!sheet) {
            socket.emit('error', 'sheet not found');
            return;
        }
        if (
            sheet.owner.toString() === _id.toString() ||
            sheet.users.includes(_id)
        ) {
            socket.join(this.sheetId);

            socket.on(Events.ACQUIRE_CELL, (payload) =>
                this.acquireCell(socket, payload)
            );
            socket.on(Events.RELEASE_CELL, (payload) =>
                this.releaseCell(socket, payload)
            );
            socket.on(Events.SELECT_CELL, (payload) =>
                this.selectCell(socket, payload)
            );
            socket.on(Events.CHANGE_CELL, (payload) =>
                this.changeCell(socket, payload)
            );
            socket.on(Events.NEW_MESSAGE, (payload) =>
                this.relayMessage(socket, payload)
            );
            socket.on(Events.LEAVE_ROOM, () => this.leave(socket));

            // TODO: rattraper tout les evenements manqués et envoyer la feuille

            this.io.to(this.sheetId).emit(Events.ROOM_JOINED, {
                userId: socket.decoded._id
            });
            for (const [key, obj] of this.users.entries()) {
                socket.emit(Events.ROOM_JOINED, {
                    userId: key
                });
                if (obj.position) {
                    socket.emit(Events.CELL_SELECTED, {
                        userId: key,
                        ...obj.position
                    });
                }
            }
            if (!this.users.has(socket.decoded._id)) {
                this.users.set(socket.decoded._id, {
                    position: null
                });
            }
        } else {
            socket.emit('error', 'you are not allowed to join this room');
        }
        socket.data.room = this;
    }

    async acquireCell(socket, payload) {
        const { x, y } = payload;
        const key = `${x},${y}`;
        await this.mutex.runExclusive(async () => {
            const holderId = this.cellsHolder.get(key);
            if (holderId === undefined) {
                this.cellsHolder.set(key, socket.decoded._id);
                this.io.to(this.sheetId).emit(Events.CELL_ACQUIRED, {
                    holderId: socket.decoded._id,
                    x,
                    y
                });
            } else {
                socket.emit(Events.CELL_HOLDED, {
                    holderId,
                    x,
                    y
                });
            }
        });
    }

    async releaseCell(socket, payload) {
        const { x, y } = payload;
        const key = `${x},${y}`;
        await this.mutex.runExclusive(async () => {
            if (this.cellsHolder.get(key) === socket.decoded._id) {
                this.cellsHolder.delete(key);
                this.io.to(this.sheetId).emit(Events.CELL_RELEASED, {
                    holderId: socket.decoded._id,
                    x,
                    y
                });
            }
        });
    }

    async selectCell(socket, payload) {
        const { x, y } = payload;
        try {
            this.io.to(this.sheetId).emit(Events.CELL_SELECTED, {
                userId: socket.decoded._id,
                x,
                y
            });
            this.users.set(socket.decoded._id, {
                position: { x, y }
            });
        } catch (error) {
            logger.error(error);
        }
    }

    async changeCell(socket, payload) {
        const { x, y, formula, style } = payload;
        // verify the payload
        if (
            typeof x !== 'number' ||
            typeof y !== 'number' ||
            typeof formula !== 'string' ||
            typeof style !== 'object'
        ) {
            socket.emit('error', 'invalid payload');
            return;
        }
        const key = `${x},${y}`;

        if (this.cellsHolder.get(key) !== socket.decoded._id) {
            socket.emit('error', 'you are not the owner of this cell');
            return;
        }
        /**
         * Les transactions ne sont disponibles que pour les replica set avec mongodb
         * mais de toute façon on travaille en exclusion mutuelle sur la cellule
         */
        try {
            /**
             * Fix
             * L'upsert est mal documenté et ne fonctionne pas comme on le pense
             * donc il a été remplacé par du JS pure mais la liste entiere des cellules est echangée avec le sgbd
             * ce n'est pas optimal.
             */
            const sheet = await Sheet.findById(this.sheetId);
            if (!sheet) {
                socket.emit('error', 'sheet not found');
                return;
            }
            const cellIndex = sheet.cells.findIndex(
                (cell) => cell.x === x && cell.y === y
            );

            if (cellIndex === -1) {
                // Ajouter la nouvelle cellule
                sheet.cells.push({ x, y, formula, style });
            } else {
                // Mettez à jour la cellule existante
                sheet.cells[cellIndex].formula = formula;
                sheet.cells[cellIndex].style = style;
            }
            await sheet.save();
            this.io.to(this.sheetId).emit(Events.CELL_CHANGED, {
                x,
                y,
                formula,
                style,
                userId: socket.decoded._id
            });
        } catch (error) {
            logger.error(error);
            socket.emit('error', 'error while changing cell');
        }
    }

    async leave(socket) {
        /**
         * On vérifie que le socket n'a pas déjà quitté la room
         * pour éviter une boucle infinie dans l'event disconnect
         */
        if (socket.data.leaved) return;
        socket.leave(this.sheetId);
        this.users.delete(socket.decoded._id);
        this.mutex.runExclusive(async () => {
            for (const [key, holderId] of this.cellsHolder.entries()) {
                if (holderId === socket.decoded._id) {
                    this.cellsHolder.delete(key);
                    const { x, y } = key.split(',');
                    socket.to(this.sheetId).emit(Events.CELL_RELEASED, {
                        holderId: socket.decoded._id,
                        x,
                        y
                    });
                }
            }
        });
        this.io.to(this.sheetId).emit(Events.ROOM_LEAVED, {
            userId: socket.decoded._id
        });
        // disconnect socket
        socket.disconnect();
        socket.data.leaved = true;
    }

    async relayMessage(socket, payload) {
        const { message } = payload;
        if (typeof message !== 'string') {
            socket.emit('error', 'invalid payload');
            return;
        }
        this.io.to(this.sheetId).emit(Events.NEW_MESSAGE, {
            userId: socket.decoded._id,
            message: message.substring(0, 1023)
        });
    }
}
