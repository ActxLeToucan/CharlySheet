export class HttpException extends Error {
    /**
     * @type {number}
     */
    status;
    /**
     * @type {string}
     */
    message;
    /**
     * @type {string | undefined}
     */
    publicMessage;

    /**
     * @param {number} status
     * @param {string} message
     * @param {string | undefined} publicMessage
     */
    constructor(status, message, publicMessage) {
        super(message);
        this.status = status;
        this.message = message;
        this.publicMessage = publicMessage;
    }
}
