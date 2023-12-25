import { Mutex } from 'async-mutex';

import { Sheet } from '../models/sheet.model.js';
import { logger } from '../utils/logger.js';
import { Events } from './index.js';

export class RoomSheet {
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
        if (sheet.owner.toString() === _id.toString() || sheet.users.includes(_id)) {
            socket.join(this.sheetId);

            socket.on(Events.ACQUIRE_CELL, (payload) => this.acquireCell(socket, payload));
            socket.on(Events.RELEASE_CELL, (payload) => this.releaseCell(socket, payload));
            socket.on(Events.SELECT_CELL, (payload) => this.selectCell(socket, payload));
            socket.on(Events.CHANGE_CELL, (payload) => this.changeCell(socket, payload));
            socket.on(Events.NEW_MESSAGE, (payload) => this.relayMessage(socket, payload));
            socket.on(Events.LEAVE_ROOM, () => this.leave(socket));

            // TODO: rattraper tout les evenements manqués et envoyer la feuille

            this.io.to(this.sheetId).emit(Events.ROOM_JOINED, {
                userId: socket.decoded._id
            });
            for (const [key, obj] of this.users.entries()) {
                console.log(key, obj);
                socket.emit(Events.ROOM_JOINED, {
                    userId: key
                });
                if (obj.position) {
                    socket.emit(Events.CELL_SELECTED, {
                        userId: key, ...obj.position
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
    }

    async acquireCell(socket, payload) {
        const { x, y } = payload;
        const key = `${x},${y}`;
        await this.mutex.runExclusive(async () => {
            const holderId = this.cellsHolder.get(key);
            if (holderId === undefined) {
                this.cellsHolder.set(key, socket.decoded._id);
                this.io.to(this.sheetId).emit(Events.CELL_ACQUIRED, {
                    holderId: socket.decoded._id, x, y
                });
            } else {
                socket.emit(Events.CELL_HOLDED, {
                    holderId, x, y
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
                    holderId: socket.decoded._id, x, y
                });
            }
        });
    }

    async selectCell(socket, payload) {
        const { x, y } = payload;
        try {
            this.io.to(this.sheetId).emit(Events.CELL_SELECTED, {
                userId: socket.decoded._id, x, y
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
        if (typeof x !== 'number' || typeof y !== 'number' || typeof formula !== 'string' || typeof style !== 'object') {
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
            const filter = { _id: this.sheetId, 'cells.x': x, 'cells.y': y };
            const update = {
                $set: { 'cells.$.formula': formula, 'cells.$.style': style }
            };
            const options = { new: true };

            let sheet = await Sheet.findOneAndUpdate(filter, update, options);

            if (!sheet) {
                const pushUpdate = {
                    $push: { cells: { x, y, formula, style } }
                };
                sheet = await Sheet.findOneAndUpdate({ _id: this.sheetId }, pushUpdate, options);
            }
            this.io.to(this.sheetId).emit(Events.CELL_CHANGED, {
                x, y, formula, style
            });
        } catch (error) {
            logger.error(error);
            socket.emit('error', 'error while changing cell');
        }
    }

    async leave(socket) {
        socket.leave(this.sheetId);
        this.users.delete(socket.decoded._id);
        this.mutex.runExclusive(async () => {
            for (const [key, holderId] of this.cellsHolder.entries()) {
                if (holderId === socket.decoded._id) {
                    this.cellsHolder.delete(key);
                    const { x, y } = key.split(',');
                    socket.to(this.sheetId).emit(Events.CELL_RELEASED, {
                        holderId: socket.decoded._id, x, y
                    });
                }
            }
        });
        this.io.to(this.sheetId).emit(Events.ROOM_LEAVED, {
            userId: socket.decoded._id
        });
        // disconnect socket
        socket.disconnect();
    }

    async relayMessage(socket, payload) {
        const { message } = payload;
        if (typeof message !== 'string') {
            socket.emit('error', 'invalid payload');
            return;
        }
        this.io.to(this.sheetId).emit(Events.NEW_MESSAGE, {
            userId: socket.decoded._id, message: message.substring(0, 1023)
        });
    }
}
