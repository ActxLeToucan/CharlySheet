import { Server } from 'engine.io';

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
        io.on('connection', (socket) => {
            console.log('new connection');
            socket.on('ping', () => {
                socket.emit('pong', 'pong!!!');
            });
            // join room
            socket.on('join', (payload) => {
                // test if guy has permission to join room
                if (checkRight(payload)) {
                    socket.join(payload.roomId);
                } else {
                    socket.emit(
                        'error',
                        'you are not allowed to join this room'
                    );
                }
            });
        });
    }
}

const checkRight = async (payload) => {
    const { token, roomId } = payload;
};
