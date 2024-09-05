const fs = require('fs');
const path = require('path');

const {ExtensionApi} = require('./extension-api');
const {Event} = require('../event/event');
const {EventRouter} = require('../event/event-router');

/**
 * This reference Extension implementation register the extension and keep pulling next event.
 * It can be used as a base class for other extensions.
 *
 * @class
 */
class Extension {

    /**
     * Extension event types.
     *
     * @type {{INVOKE: string, SHUTDOWN: string}}
     */
    static EventType = {
        INVOKE: 'INVOKE',
        SHUTDOWN: 'SHUTDOWN'
    }

    extensionApi = new ExtensionApi();
    eventRouter = new EventRouter();

    /**
     * Extension unique identifier return during registration
     * @type {string}
     */
    extensionId;

    /**
     *
     * @type {Set<String>}
     */
    events = new Set();

    constructor() {
        // The extension name must match the file name of the extension itself that's in /opt/extensions/
        // Here we use the name of the dir where the lib is being used
        const processPath = process.argv[1];
        this.name = (fs.lstatSync(processPath).isDirectory() ?
            path.basename(processPath) : path.basename(path.dirname(processPath)));
    }

    /**
     * Initialize the extension registering it with Lambda Service
     *
     */
    async register() {
        console.log('[extension] Registering extension');
        const extensionEvents = Array.from(this.events).filter(e => Extension.EventType[e]);
        this.extensionId = await this.extensionApi.register(this.name, extensionEvents);
    }

    /**
     * Retrieve events from Lambda Service and forward them to the event router.
     *
     * @return {Promise<void>}
     */
    async pullEvents() {
        console.log('[extension] Waiting next event');
        const extensionEvent = await this.extensionApi.next(this.extensionId);
        const event = new Event(extensionEvent.eventType, extensionEvent);
        await this.eventRouter.route([event]);
    }

    /**
     * Bind a handler to an event type.
     * Only handler is accepted for each event type. Multiple handlers for the same event type will be ignored.
     *
     * Note: This method should be invoked prior to run(), otherwise the Extension can potentially lose events.
     *
     * @param {string} eventType
     * @param {Function} handler
     */
    bind(eventType, handler) {
        if (!this.eventRouter.hasRoute(eventType)) {
            this.events.add(eventType);
            this.eventRouter.addRoute(eventType, handler);
        } else {
            console.warn(`[extension] Handler for event type ${eventType} has already been bound`);
        }
    }

    /**
     * Lifecycle method executed before Extension registration.
     *
     * @return {Promise<void>}
     */
    async beforeRegister() {
        // dummy
    }

    /**
     * Lifecycle method executed before Extension registration.
     *
     * @return {Promise<void>}
     */
    async afterRegister() {
        if (this.events.has(Extension.EventType.INVOKE) || this.events.has(Extension.EventType.SHUTDOWN)) {
            while (true) {
                await this.pullEvents();
            }
        }
    }

    /**
     * Start the extension.
     * Note: This method should be invoked after all the handlers are bound.
     *
     * @return {Promise<void>}
     */
    async run() {
        await this.beforeRegister();
        await this.register();
        await this.afterRegister();
    }
}

module.exports = {Extension};