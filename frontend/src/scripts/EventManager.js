import { io } from 'socket.io-client';

class EventManager {
    static #instance = null;

    /**
     * Get Event Manager instance
     * @return {EventManager} Event manager instance
     */
    static get Instance() {
        if (this.#instance == null)
            this.#instance = new EventManager();
        return this.#instance;
    }

    #socket = null;
    listeners = {
        '<all>': []
    };

    /**
     * Creates a new EventManager object, with a socket connection to the server
     * @param {string} userToken user token to use for the socket connection
     */
    constructor(userToken) {
        const SOCKET_HOST = import.meta.env.VITE_SOCKETIO_HOST;

        this.#socket = io(SOCKET_HOST, { auth: { token: userToken } });
        this.#setupSocket();
    }

    #setupSocket() {
        this.#socket.onAny((...args) => {
            this.listeners['<all>'].forEach(cb => {
                cb(...args);
            });
            const ev = args[0];
            if (this.listeners[ev] !== undefined) {
                this.listeners[ev].forEach(cb => {
                    cb(...args.slice(1));
                });
            }
        });
    }

    addEventListener(ev, callback=undefined) {
        if (callback === undefined) {
            this.listeners['<all>'].push(ev); // [ev] is the callback
        } else {
            if (this.listeners[ev] === undefined) {
                this.listeners[ev] = [];
            }
            this.listeners[ev].push(callback);
        }
    }

    sendEvent(ev, data) {
        console.log('Sent event : ' + ev, JSON.stringify(data, null, 2));
        this.#socket.emit(ev, data);
    }
}

export default EventManager;