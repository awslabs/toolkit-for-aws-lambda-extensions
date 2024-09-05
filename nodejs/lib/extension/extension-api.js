const {HttpClient} = require('../http/http-client');
const {Environment} = require("../util/environment");

////const HOST_PORT = (process.env.AWS_LAMBDA_RUNTIME_API) ? process.env.AWS_LAMBDA_RUNTIME_API : 'localhost:9001';
const HOST = Environment.LAMBDA_RUNTIME_API;
const BASE_URL = `http://${HOST}/2020-01-01/extension`;
const EXTENSION_URL = `${BASE_URL}/register`;
const NEXT_EVENT_URL = `${BASE_URL}/event/next`;

/**
 * Lambda Extension API client.
 *
 *  {@link https://docs.aws.amazon.com/lambda/latest/dg/runtimes-extensions-api.html | API Reference}
 *
 * @class
 */
class ExtensionApi {

    /**
     * Register the extension in the Lambda service.
     *
     * @param {string} name
     * @param {string[]} events
     * @return {Promise<string>} extensionId
     */
    async register(name, events) {
        const registrationHeaders = {
            'Content-Type': 'application/json',
            'Lambda-Extension-Name': name
        };

        const body = { events: events };

        const response = await HttpClient.invoke(EXTENSION_URL, 'POST', body, registrationHeaders);

        let extensionId;
        if (response.ok) {
            extensionId = response.headers.get('lambda-extension-identifier');
        } else {
            const error = response.text();
            console.error(`[extension-api] Failed to register extension: ${error}`);
        }

        return extensionId;
    };

    /**
     * Executed when Lambda invokes the function handler
     *
     * @param {string} extensionId
     * @return {object} event
     */
    async next(extensionId) {
        const response = await HttpClient.invoke(NEXT_EVENT_URL, 'GET', null, {
            'Content-Type': 'application/json',
            'Lambda-Extension-Identifier': extensionId,
        });

        let event;
        if (response.ok) {
            event = response.json();
        } else {
            const error = response.text();
            console.error(`[extension-api] Failed receiving next event: ${error}`);
        }

        return event;
    }
}

module.exports = {ExtensionApi};