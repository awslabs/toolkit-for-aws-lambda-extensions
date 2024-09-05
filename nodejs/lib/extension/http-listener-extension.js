const {Extension} = require('../extension/extension');
const {HttpListener} = require('../http/http-listener');
const {Environment} = require("../util/environment");

const LISTENER_HOST = Environment.LISTENER_HOST;

/**
 * Adds an HTTP listener to the reference Extension implementation.
 *
 * @class
 */
class HttpListenerExtension extends Extension {

    /**
     * @type {HttpListener}
     */
    httpListener;

    /**
     * @type {string}
     */
    listenerUrl;

    /**
     *
     * @param {number} port
     */
    constructor(port) {
        super();
        this.httpListener = new HttpListener(LISTENER_HOST, port);
    }

    /**
     * Starts the HTTP listener before registering the extension.
     *
     * @return {Promise<void>}
     */
    async beforeRegister() {
        await super.beforeRegister();
        this.listenerUrl = this.httpListener.start();
    }
}

module.exports = {HttpListenerExtension};