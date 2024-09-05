const http = require('http');
const {HttpResponse} = require("./http-response");

/**
 * Basic HTTP Listener Implementation.
 *
 * @class
 */
class HttpListener {

    host;
    port;
    /**
     * Map of HTTP method x Handlers.
     *
     * @type {Map<string, function>}
     */
    handlers = new Map();

    /**
     *
     * @param host server port
     * @param port server host
     */
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }

    /**
     * Handler for HTTP Requests
     *
     * @callback HttpRequestHandler
     * @param {string} body request body
     * @param {object} properties request properties
     * @return {Promise<HttpResponse>} response
     */

    /**
     * Register a handler for a specific HTTP method.
     *
     * If no response is returned, the request is will return statusCode 200 and empty body.
     *
     * @param {('GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'CONNECT'|'OPTIONS'|'TRACE'|'PATCH')} method
     * @param {HttpRequestHandler} handler
     */
    on(method, handler) {
        this.handlers.set(method.toUpperCase(), handler);
    }

    /**
     * Start the HTTP server and return the listener URL.
     *
     * @return {string} listener URL
     */
    start() {
        const handlers = this.handlers;

        // init HTTP server for the Logs API subscription
        const server = http.createServer(function(request, response) {
            let body = [];
            const properties = {
                path: request.url,
                method: request.method,
                headers: request.headers
            };

            const defaultHandler = () => { console.log(`[http-listener] No handler for ${request.method}`) };
            const defaultHandlerResponse = new HttpResponse(200, null, {});

            request.on('data', function(data) {
                body.push(data);
            });

            request.on('end', async function() {
                const handler = handlers.get(request.method) || defaultHandler;
                const handlerResponse = await handler(body.toString(), properties) || defaultHandlerResponse;
                response.writeHead(handlerResponse.statusCode, Object.fromEntries(handlerResponse.headers));
                response.end(handlerResponse.text());
            });
        });

        server.listen(this.port, this.host);
        const listenerUrl = `http://${this.host}:${this.port}`;
        console.log(`[http-listener] Listening at ${listenerUrl}`);

        return listenerUrl;
    }
}

module.exports = {HttpListener};