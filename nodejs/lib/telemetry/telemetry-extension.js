const {TelemetryApi} = require('./telemetry-api');
const {HttpListenerExtension} = require("../extension/http-listener-extension");
const {Event} = require("../event/event");

const TELEMETRY_LISTENER_PORT = 4243;

/**
 *
 * @class
 */
class TelemetryExtension extends HttpListenerExtension {

    /**
     * The types of telemetry that you want the extension to subscribe to.
     *
     * @type {{PLATFORM: string, FUNCTION: string, EXTENSION: string}}
     */
    static EventType = {
        PLATFORM: 'platform',
        FUNCTION: 'function',
        EXTENSION: 'extension'
    }

    telemetryApi = new TelemetryApi();

    constructor() {
        super(TELEMETRY_LISTENER_PORT);
    }

    /**
     * Subscribe the extension to the Telemetry API.
     *
     * @param listenerUrl
     * @return {Promise<void>}
     */
    async subscribe(listenerUrl) {
        const telemetryEvents = Array.from(this.events).filter(e => TelemetryExtension.EventType[e.toUpperCase()]);
        await this.telemetryApi.subscribe(this.extensionId, listenerUrl, telemetryEvents);
    }

    async beforeRegister() {
        // define how to handle incoming telemetry event
        this.httpListener.on('POST', async (body) => {
            const httpEvents = JSON.parse(body);
            const events = httpEvents.map(httpEvent => new Event(httpEvent.type, httpEvent));
            await this.eventRouter.route(events);
        });

        // start listener
        await super.beforeRegister();
    }

    async afterRegister() {
        // subscribe to telemetry events
        await this.subscribe(this.listenerUrl);
        await super.afterRegister();
    }
}

module.exports = {TelemetryExtension};