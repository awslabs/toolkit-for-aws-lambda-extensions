const {HttpClient} = require('../http/http-client');
const {Environment} = require("../util/environment");

//const HOST_PORT = (process.env.AWS_LAMBDA_RUNTIME_API) ? process.env.AWS_LAMBDA_RUNTIME_API : 'localhost:9001';
const HOST = Environment.LAMBDA_RUNTIME_API;
const TELEMETRY_URL = `http://${HOST}/2022-07-01/telemetry`;

const TIMEOUT_MS = 1000; // Maximum time (in milliseconds) that a batch is buffered.
const MAX_BYTES = 256 * 1024; // Maximum size in bytes that the logs are buffered in memory.
const MAX_ITEMS = 10000; // Maximum number of events that are buffered in memory.

/**
 * Lambda Telemetry API client.
 *
 * {@link https://docs.aws.amazon.com/lambda/latest/dg/telemetry-api-reference.html | API Reference}
 *
 * @class
 */
class TelemetryApi {

    /**
     * Subscribe to the telemetry API.
     *
     * @param {string} extensionId
     * @param {string} listenerUri
     * @param {string[]} types - The types of telemetry that you want the extension to subscribe to.
     *                           Must be one of: {@link TelemetryExtension.EventType.PLATFORM},
     *                           {@link TelemetryExtension.EventType.FUNCTION}, or
     *                           {@link TelemetryExtension.EventType.EXTENSION}.
     */
    async subscribe(extensionId, listenerUri, types) {
        console.log('[telemetry-api] Subscribing', { baseUrl: TELEMETRY_URL, extensionId, listenerUri });

        const subscriptionBody = {
            schemaVersion: "2022-07-01",
            destination: {
                protocol: "HTTP",
                URI: listenerUri,
            },
            types: types,
            buffering: {
                timeoutMs: TIMEOUT_MS,
                maxBytes: MAX_BYTES,
                maxItems: MAX_ITEMS
            }
        };

        const subscriptionHeaders = {
            'Content-Type': 'application/json',
            'Lambda-Extension-Identifier': extensionId,
        };

        const response = await HttpClient.invoke(TELEMETRY_URL, 'PUT', subscriptionBody, subscriptionHeaders)


        switch (response.statusCode) {
            case 200:
                console.log('[telemetry-api] Subscription success');
                break;
            case 202:
                console.warn('[telemetry-api] Telemetry API not supported. Are you running the extension locally?');
                break;
            default:
                console.error('[telemetry-api] Subscription failure:', response.text());
                break;
        }
    }
}

module.exports = {TelemetryApi};