export default class Callbackable {
    #callbackCounter = 0;
    #callbacks = [];

    _callCallbacks(event, ...args) {
        this.#callbacks[event]?.forEach(obj => {
            obj.callback(...args);
        });
    }

    _addCallback(event, callback) {
        const counterIndex = this.#callbackCounter++;
        if (!this.#callbacks[event]) this.#callbacks[event] = [];
        this.#callbacks[event].push({nbr: counterIndex, callback});
        return counterIndex;
    }

    remCallback(nbr) {
        for (const event in this.#callbacks) {
            this.#callbacks[event] = this.#callbacks[event].filter(callback => callback.nbr !== nbr);
        }
    }

    on(event, callback) {
        return this._addCallback(event, callback);
    }

    no(nbr) {
        this.remCallback(nbr);
    }
}
