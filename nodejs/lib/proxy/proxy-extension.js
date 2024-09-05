/**
 * Lambda Runtime Proxy extension pattern.
 *
 * Ref: https://aws.amazon.com/blogs/compute/enhancing-runtime-security-and-governance-with-the-aws-lambda-runtime-api-proxy-extension/
 */

const {Extension} = require("../extension/extension");
const {HttpListenerExtension} = require("../extension/http-listener-extension");
const {HttpResponse} = require("../http/http-response");
const {RuntimeApi} = require("./runtime-api");
const {Event} = require("../event/event");
const {Environment} = require("../util/environment");
const {RegexHandlerMap} = require("../util/regex-handler-map");

const PROXY_LISTENER_PORT = 9009;
const DEV_PORTAL_ORIGIN = 'http://localhost:3000';

class ProxyExtension extends HttpListenerExtension {

    /**
     * Extension event types.
     *
     * @type {{INCOMING_EVENT: string, FUNCTION_RESPONSE: string}}
     */
    static EventType = {
        INCOMING_EVENT: 'INCOMING_EVENT',
        FUNCTION_RESPONSE: 'FUNCTION_RESPONSE'
    }

    runtimeApi = new RuntimeApi();
    pathHandlerMapper = new RegexHandlerMap();

    constructor() {
        super(PROXY_LISTENER_PORT);
        // associate the API path to your respective handlers
        this.pathHandlerMapper.add('/2018-06-01/runtime/invocation/next', this.onInvocationNext.bind(this));
        this.pathHandlerMapper.add('/2018-06-01/runtime/invocation/(?<requestId>.+)/response', this.onInvocationResponse.bind(this));
        this.pathHandlerMapper.add('/2018-06-01/runtime/invocation/(?<requestId>.+)/error', this.onInvocationError.bind(this));
        this.pathHandlerMapper.add('/2018-06-01/runtime/init/error', this.onInitError.bind(this));
    }

    /**
     * Triggered when the runtime requests the next invocation event.
     *
     * @param body
     * @param properties
     * @param urlParams
     * @return {Promise<HttpResponse>}
     */
    async onInvocationNext(body, properties, urlParams) {
        let incomingEvent;

        do {
            const apiResponse = await this.runtimeApi.next(this.extensionId);

            incomingEvent = {
                statusCode: apiResponse.statusCode,
                body: apiResponse.text(),
                headers: apiResponse.headers
            };

            const event = new Event(ProxyExtension.EventType.INCOMING_EVENT, incomingEvent);
            const responseByType = await this.eventRouter.route([event]);
            incomingEvent = responseByType.get(ProxyExtension.EventType.INCOMING_EVENT);

            if(incomingEvent === null) console.log('[proxy-extension] handler dropped event');
        } while (incomingEvent === null);

        const httpResponse = new HttpResponse(incomingEvent.statusCode, incomingEvent.body, incomingEvent.headers);
        httpResponse.headers.delete('content-length'); // avoid issues with body manipulation

        return httpResponse;
    }

    /**
     * Triggered when after the function has run to completion and sends a response.
     *
     * @param body
     * @param properties
     * @param urlParams
     * @return {Promise<HttpResponse>}
     */
    async onInvocationResponse(body, properties, urlParams) {
        const event = new Event(ProxyExtension.EventType.FUNCTION_RESPONSE, JSON.parse(body));

        // TODO Create specific routing method that returns a single eventResponse
        const responseByType = await this.eventRouter.route([event]);
        const proxiedResponse = responseByType.get(ProxyExtension.EventType.FUNCTION_RESPONSE);
        // check whether the proxy handler is overriding or not the function response
        const functionResponse = (proxiedResponse) ? proxiedResponse:body;

        // forward the response to the lambda service
        const requestId = urlParams.requestId;
        const httpResponse = await this.runtimeApi.response(requestId, functionResponse);

        return httpResponse;
    }

    /**
     * Triggered when the function encounters an error while running.
     *
     * @param body
     * @param properties
     * @param urlParams
     * @return {Promise<HttpResponse>}
     */
    async onInvocationError(body, properties, urlParams) {
        console.error('[proxy-extension] invocation error ');
        const requestId = urlParams.requestId;
        return await this.runtimeApi.invocationError(requestId, body, properties.headers);
    }

    /**
     * Triggered when the runtime encounters an error while initializing.
     * @param body
     * @param properties
     * @return {Promise<HttpResponse>}
     */
    async onInitError(body, properties) {
        console.error('[proxy-extension] init error');
        return await this.runtimeApi.initError(body, properties.headers);
    }

    /**
     * Handler for HTTP OPTIONS request.
     * Used to handle CORS pre-flight requests.
     *
     * @param body
     * @param properties
     * @return {Promise<HttpResponse>}
     */
    async httpOptionsHandler(body, properties) {
        return new HttpResponse(200, null, {
            'Access-Control-Allow-Origin': DEV_PORTAL_ORIGIN,
            'Access-Control-Allow-Headers': '*'
        });
    }

    /**
     * Handler for HTTP Listener
     *
     * @param body
     * @param properties
     * @return {Promise<HttpRequestHandler>}
     */
    async httpRequestHandler(body, properties) {
        const {handler, params} = this.pathHandlerMapper.getHandler(properties.path);
        if (handler) {
            const httpResponse = await handler(body, properties, params);
            // CORS support for local development
            if(!Environment.IS_RUNNING_ON_AWS) {
                httpResponse.headers.set('Access-Control-Allow-Origin', DEV_PORTAL_ORIGIN);
            }

            return httpResponse;
        } else {
            console.error(`[proxy-extension] Invalid request received ${properties.method} ${properties.path}`);
        }
    }

    async beforeRegister() {
        const httpRequestHandler = this.httpRequestHandler.bind(this);
        this.httpListener.on('GET', httpRequestHandler);
        this.httpListener.on('POST', httpRequestHandler);
        this.httpListener.on('OPTIONS', this.httpOptionsHandler);

        // start listener
        await super.beforeRegister();
    }

    async afterRegister() {
        // if there are no handlers bound for Extensions events, force event next to avoid timeout during extension init
        if(!this.events.has(Extension.EventType.INVOKE) && !this.events.has(Extension.EventType.SHUTDOWN)) {
            await this.pullEvents();
        }

        await super.afterRegister();
    }
}


module.exports = {ProxyExtension};