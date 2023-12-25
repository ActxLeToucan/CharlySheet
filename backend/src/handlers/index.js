import { Mutex } from 'async-mutex';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/index.js';
import { RoomSheet } from './roomSheet.handlers.js';

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
 */

/** @type {Events} */
export const Events = {
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
    NEW_MESSAGE: 'newMessage'
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
            socket.on(Events.JOIN_ROOM, async (payload) => {
                console.log('join', payload);
                const room = await RoomOrganizer.getRoom(payload.sheetId, io);
                room.join(socket);
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
}
