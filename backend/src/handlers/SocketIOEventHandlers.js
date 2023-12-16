import { Mutex } from 'async-mutex';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import mongoose from 'mongoose';

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
    LEAVE_ROOM: 'leaveRoom'
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
                console.log('disconnected');
            });
            // join room
            socket.on(Events.JOIN_ROOM, (payload) => {
                console.log('join', payload);
                new RoomSheet(payload.sheetId).join(socket);
                // // test if guy has permission to join room
                // if (checkRight(socket, payload)) {
                //     socket.join(payload.roomId);
                // } else {
                //     socket.emit(
                //         'error',
                //         'you are not allowed to join this room'
                //     );
                // }
            });
        });
    }
}

const checkRight = async (socket, payload) => {
    const { roomId } = payload;
    const { token } = socket.handshake.auth;
    const sheet = await Sheet.findById(roomId);
    const { _id } = jwtDecode(token);
    if (sheet.ownerId === _id) {
        return true;
    }
};

const roomsMutex = new Map();
const getRoomMutex = new Mutex();
const getRoom = (roomId) => {
    if (!roomsMutex.has(roomId)) {
        getRoomMutex.runExclusive(() => {
            if (!roomsMutex.has(roomId)) {
                roomsMutex.set(roomId, new Mutex());
            }
        });
    }
    return roomsMutex.get(roomId);
};

class RoomSheet {
    constructor(sheetId) {
        this.sheetId = sheetId;
        this.mutex = new Mutex();
        this.cellsHolder = new Map();
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

            socket.on(Events.ACQUIRE_CELL, (payload) => this.acquireCell(socket, payload));
            socket.on(Events.RELEASE_CELL, (payload) => this.releaseCell(socket, payload));
            socket.on(Events.SELECT_CELL, (payload) => this.selectCell(socket, payload));
            socket.on(Events.CHANGE_CELL, (payload) => this.changeCell(socket, payload));
            socket.on(Events.LEAVE_ROOM, () => this.leave(socket));

            // TODO: rattraper tout les evenements manqués et envoyer la feuille

            socket.emit(Events.ROOM_JOINED, {});
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
                socket.to(this.sheetId).emit(Events.CELL_ACQUIRED, {
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
                socket.to(this.sheetId).emit(Events.CELL_RELEASED, {
                    holderId: socket.decoded._id,
                    x,
                    y
                });
            }
        });
    }

    async selectCell(socket, payload) {
        const { x, y } = payload;
        socket.to(this.sheetId).emit(Events.CELL_SELECTED, {
            userId: socket.decoded._id,
            x,
            y
        });
    }

    async changeCell(socket, payload) {
        const { x, y, formula, style } = payload;
        const key = `${x},${y}`;

        if (this.cellsHolder.get(key) !== socket.decoded._id) {
            socket.emit('error', 'you are not the owner of this cell');
            return;
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await Sheet.findOneAndUpdate(
                { _id: this.sheetId, 'cells.x': x, 'cells.y': y },
                {
                    $set: {
                        'cells.$.formula': formula,
                        'cells.$.style': style
                    }
                },
                { upsert: true, new: true, session }
            );
            await session.commitTransaction();

            socket.to(this.sheetId).emit(Events.CELL_CHANGED, {
                x,
                y,
                formula,
                style
            });
        } catch (error) {
            logger.error(error);
            socket.emit('error', 'error while changing cell');

            await session.abortTransaction();
        } finally {
            session.endSession();
        }
    }

    async leave(socket) {
        socket.leave(this.sheetId);
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
    }
}
