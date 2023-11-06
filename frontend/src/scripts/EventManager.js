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

    constructor() {
        const SOCKET_HOST = import.meta.env.VITE_SOCKETIO_HOST;
        const SOCKET_PATH = import.meta.env.VITE_SOCKETIO_PATH;

        this.#socket = io(SOCKET_HOST, { path: SOCKET_PATH });
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
        this.#socket.emit(ev, data);
    }
}

export default EventManager;