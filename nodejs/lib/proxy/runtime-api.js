const {Environment} = require('../util/environment');
const {HttpClient} = require('../http/http-client');
const {HttpResponse} = require("../http/http-response");

const HOST = Environment.LAMBDA_RUNTIME_API;
const BASE_URL = `http://${HOST}/2018-06-01/runtime`;
const NEXT_INVOCATION_URL = `${BASE_URL}/invocation/next`;
const INVOCATION_RESPONSE_URL = `${BASE_URL}/invocation/$REQUEST_ID/response`;
const INVOCATION_ERROR_URL = `${BASE_URL}/invocation/$REQUEST_ID/error`;
const INIT_ERROR_URL = `${BASE_URL}/init/error`;

/**
 * Lambda Runtime API client.
 *
 * {@link https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html | API Reference}
 *
 * @class
 */
class RuntimeApi {

    /**
     * Request Lambda an invocation event.
     *
     * @return {HttpResponse} response
     */
    async next(extensionId) {
        return await HttpClient.invoke(
            NEXT_INVOCATION_URL,
            'GET', null,
            {'Lambda-Extension-Identifier': extensionId});
    }

    /**
     * Sends function invocation response to Lambda.
     *
     * @param requestId
     * @param response
     * @return {Promise<HttpResponse>}
     */
    async response(requestId, response) {
        return await HttpClient.invoke(INVOCATION_RESPONSE_URL.replace('$REQUEST_ID', requestId), 'POST', response);
    }

    async initError(error, headers) {
        return await HttpClient.invoke(INIT_ERROR_URL, 'POST', error, headers);
    }

    async invocationError(requestId, error, headers) {
        return await HttpClient.invoke(INVOCATION_ERROR_URL.replace('$REQUEST_ID', requestId), 'POST', error, headers);
    }
}

module.exports = {RuntimeApi};