import express from 'express';
import EventEmitter from 'node:events';
import TelemetryApiEventTemplates from './telemetry-api-event-templates.js';

import { getLogger } from "../logger.js";
const logger = getLogger('lambda-api-server');

const EXTENSIONS_API_STATE_CODES = {
    WAITING_FOR_REGISTRATION: 100,
    WAITING_FOR_NEXT_REQUEST: 200,
    WAITING_FOR_NEXT_RESPONSE: 300
}

const RUNTIME_API_STATE_CODE = {
    WAITING_FOR_NEXT_REQUEST: 100,
    WAITING_FOR_NEXT_RESPONSE: 200,
    WAITING_FOR_RESPONSE_REQUEST: 300
}

const TELEMETRY_API_STATE_CODES = {
    WAITING_FOR_SUBSCRIPTION: 100,
    SUBSCRIBED: 200
}

const state = {
    extensionsApi: {
        extensionName: null,
        extensionId: null,
        extensionFeatures: null,
        subscribedEvents: null,
        message: 'Waiting for extension to register',
        stateCode: EXTENSIONS_API_STATE_CODES.WAITING_FOR_REGISTRATION
    },
    telemetryApi: {
        isSubscribed: false,
        subscribedTelemetryTypes: null,
        destinationUri: null,
        message: 'Waiting for extension to subscribe',
        stateCode: TELEMETRY_API_STATE_CODES.WAITING_FOR_SUBSCRIPTION
    },
    runtimeApi : {
        requestId: null,
        functionResponse: null,
        message: 'Waiting for runtime to request event',
        stateCode: RUNTIME_API_STATE_CODE.WAITING_FOR_NEXT_REQUEST
    }
};

const pendingExtensionsApiContext = {};
const pendingRuntimeApiContext = {};

class LambdaApiServer extends EventEmitter {
    constructor(){
        super();
        logger.trace('Constructing...');
        const app = new express();
        app.use(express.json());
        // app.use((req, res, next) => {
        //     console.log(`${req.method} | ${req.path} | ${JSON.stringify(req.body)}`);
        //     next();
        // });
        app.post('/2020-01-01/extension/register', this.handleRegisterRequest);
        app.get('/2020-01-01/extension/event/next', this.handleEventNextRequest);
        app.get('/2018-06-01/runtime/invocation/next', this.handleRuntimeInvocationNextRequest);
        app.post('/2018-06-01/runtime/invocation/:requestId/response', this.handleRuntimeInvocationResponseRequest);
        app.post('/2018-06-01/runtime/init/error', this.handleInitError);
        app.post('/2018-06-01/runtime/invocation/:requestId/error', this.handleInvocationError);
        app.put('/2022-07-01/telemetry', this.handleTapiSubscriptionRequest);
        app.listen(9001, ()=>{
            logger.info('Listening on http://localhost:9001');
        });    
    }

    handleInitError = (req, res) => {
        logger.trace(`handleInitError`);
        console.error(req.body);
        res.status(202).end();
    }

    handleInvocationError = (req, res) => {
        logger.trace(`handleInvocationError`);
        console.error(req.body);
        res.status(202).end();
    }

    handleRegisterRequest = (req, res)=>{
        logger.trace('handleRegisterRequest');
        const extensionName = req.header('Lambda-Extension-Name');
        const extensionFeatures = req.header('Lambda-Extension-Accept-Feature');
        const subscribedEvents = req.body.events;
    
        // TODO: implement validations
        state.extensionsApi.extensionName = extensionName;
        state.extensionsApi.extensionId = '12345678-1234-1234-1234-123456789012';
        state.extensionsApi.extensionFeatures = extensionFeatures;
        state.extensionsApi.subscribedEvents = subscribedEvents;
        state.extensionsApi.message = 'Extension registered, waiting for /next request'
        state.extensionsApi.stateCode = EXTENSIONS_API_STATE_CODES.WAITING_FOR_NEXT_REQUEST;
    
        res.append('Lambda-Extension-Identifier', state.extensionsApi.extensionId);
        res.json({
            functionName: 'extensionTest',
            functionVersion: '$LATEST',
            handler: 'function.handler',
            accountId: '123456789012'
        });
        this.emit('stateUpdate', state);
    }

    handleEventNextRequest = (req, res) => {
        logger.trace('handleEventNextRequest');
        const extensionId = req.header('Lambda-Extension-Identifier');
        if (extensionId !== state.extensionsApi.extensionId){
            logger.warn(`Invalid extensionId received ${extensionId}`);
            return res.status(403).send(
                `Invalid extensionId. \
                Received=${extensionId} \
                Expecting=${state.extensionsApi.extensionId}.\
                This message is produced by the Extensions API simulator.`);
        }

        pendingExtensionsApiContext.req = req;
        pendingExtensionsApiContext.res = res;
        //pendingExtensionsApiContext.next = next;

        state.extensionsApi.message = 'Received /next request, send response below'
        state.extensionsApi.stateCode = EXTENSIONS_API_STATE_CODES.WAITING_FOR_NEXT_RESPONSE;
        this.emit('stateUpdate', state);
    }

    handleRuntimeInvocationNextRequest = (req, res) => {
        logger.trace('handleRuntimeInvocationNext');
        const extensionId = req.header('Lambda-Extension-Identifier');
        if (extensionId !== state.extensionsApi.extensionId){
            logger.warn(`Invalid extensionId received ${extensionId}`);
            return res.status(403).send(
                `Invalid extensionId. \
                Received=${extensionId} \
                Expecting=${state.extensionsApi.extensionId}.\
                This message is produced by the Extensions API simulator.`);
        }

        state.runtimeApi.requestId = 'c0000000-0000-0000-0000-000000000ff3';

        pendingRuntimeApiContext.req = req;
        pendingRuntimeApiContext.res = res;
        //pendingRuntimeApiContext.next = next;

        state.runtimeApi.message = 'Received /runtime/invocation/next request, send response below'
        state.runtimeApi.stateCode = RUNTIME_API_STATE_CODE.WAITING_FOR_NEXT_RESPONSE;
        this.emit('stateUpdate', state);
    }

    handleRuntimeInvocationResponseRequest = (req, res) => {
        logger.trace('handleRuntimeInvocationResponseRequest');
        state.runtimeApi.requestId = null;
        state.runtimeApi.functionResponse = JSON.stringify(req.body);
        state.runtimeApi.message = 'Waiting for /runtime/invocation/next';
        state.runtimeApi.stateCode = RUNTIME_API_STATE_CODE.WAITING_FOR_NEXT_REQUEST;
        res.send('OK');
        this.emit('stateUpdate', state);
    }

    replyToNext = (event) => {
        logger.trace('replyToNext');
        // logger.debug({event});
        pendingExtensionsApiContext.res.append('Lambda-Extension-Event-Identifier', event.requestId);
        pendingExtensionsApiContext.res.json(event);
        state.extensionsApi.message = 'Waiting for /next request'
        state.extensionsApi.stateCode = EXTENSIONS_API_STATE_CODES.WAITING_FOR_NEXT_REQUEST
        this.emit('stateUpdate', state);
    }

    replyToRuntimeNext = (event) => {
        logger.trace('replyToRuntimeNext');
        // logger.debug({event});
        pendingRuntimeApiContext.res.append('Lambda-Extension-Event-Identifier', event.requestId);
        pendingRuntimeApiContext.res.json(event);
        state.runtimeApi.message = 'Waiting for /runtime/invocation/<request_id>/response, send response below'
        state.runtimeApi.stateCode = RUNTIME_API_STATE_CODE.WAITING_FOR_RESPONSE_REQUEST
        this.emit('stateUpdate', state);
    }

    handleTapiSubscriptionRequest = (req, res) => {
        logger.trace('handleTapiSubscriptionRequest');
        const extensionId = req.header('Lambda-Extension-Identifier');
        if (extensionId !== state.extensionsApi.extensionId){
            logger.warn(`Invalid extensionId received ${extensionId}`);
            return res.status(403).send(
                `Invalid extensionId. \
                Received=${extensionId} \
                Expecting=${state.extensionsApi.extensionId}.\
                This message is produced by the Extensions API simulator.`);
        }

        const subscribedTelemetryTypes = req.body.types;
        const destinationUri = req.body.destination.URI;

        state.telemetryApi.subscribedTelemetryTypes = subscribedTelemetryTypes;
        state.telemetryApi.destinationUri = destinationUri;
     
        state.telemetryApi.message = 'Extension subscribed to the Telemetry API'
        state.telemetryApi.stateCode = TELEMETRY_API_STATE_CODES.SUBSCRIBED;
        res.send('OK');
        this.emit('stateUpdate', state);
    }

    sendTelemetryEvents = async (eventTypes) => {
        logger.trace('sendTelemetryEvents');
        const events = [];
        for (const eventType of eventTypes){
            const event = TelemetryApiEventTemplates[eventType];
            if (!event){
                logger.warn(`Event type not found ${eventType}. Dropping.`);
            } else {
                events.push(event);
            }
        }
        // logger.debug({events});

        const requestUrl = state.telemetryApi.destinationUri;
        try {
            const response = await fetch(requestUrl, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(events)
            });
            if (response.status<200 || response.status>=300){
                logger.error(
                    `Failed to send telemetry to ${requestUrl}. \
                    response.status=${response.status}`);
            } else {
                logger.info(`Telemetry delivered to ${requestUrl}`);
            }  
        } catch(e){
            logger.error(`Failed to send telemetry to ${requestUrl}`, e);
        }
    }

    getExtensionState = () => {
        logger.trace('getExtensionState');
        return state;
    }
}

export default LambdaApiServer;
