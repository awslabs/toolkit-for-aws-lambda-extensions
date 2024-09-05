const {HttpClient} = require('toolkit-for-aws-lambda-extensions/http/http-client');

/**
 * Buffer events in a queue and dispatch them to the specified URI when the minBatchSize is reached.
 *
 * @class
 */
class EventDispatcher {

    queue = [];

    /**
     *
     * @param {string} uri URI to dispatch events
     * @param {number} minBatchSize Minimum amount of events required to flush the queue
     */
    constructor(uri, minBatchSize) {
        this.uri = uri;
        this.minBatchSize = minBatchSize;
    }

    /**
     *
     * @param {{user:string, password:string}} credentials
     */
    setCredentials(credentials) {
        this.credentials = credentials;
    }

    /**
     *
     * @param {object[]} events
     * @return {Promise<void>}
     */
    async dispatch(events) {
        if (!this.uri) {
            console.error('[event-dispatcher] URI not found. Discarding log events from the queue.');
            return;
        }

        this.queue.push(...events);
        if (this.queue.length >= this.minBatchSize) {
            await this.flush();
        } else {
            console.log(`[event-dispatcher] Adding events to queue`);
        }
    }

    async flush() {
        const eventsAmount = this.queue.length;
        if (eventsAmount > 0) {
            console.log(`[event-dispatcher] Dispatching Telemetry ${eventsAmount} events`);
            await this.sendData(this.queue);
            this.queue.length = 0;
        }
    }

    async sendData(payload) {
        let headers = {'Content-Type': 'application/json'};

        // add credentials if were specified
        if (this.credentials) {
            headers['Authorization'] = `Basic ${Buffer.from(`${this.credentials.user}:${this.credentials.password}`).toString('base64')}`;
        }

        try {
            const response = await HttpClient.invoke(this.uri, 'POST', payload, headers);
            if (!response.ok) {
                console.error(`[event-dispatcher] Failed to dispatch events: HTTP ${response.status} ${await response.text()}`);
            }
        } catch (err) {
            console.error(`[event-dispatcher] Failed to dispatch events: ${err}`);
        }
    }
}

module.exports = {EventDispatcher};