#!/usr/bin/env node

/**
 * Example on how to use the Telemetry Extension to send events to a remote endpoint.
 *
 */

const {Extension, TelemetryExtension} = require('toolkit-for-aws-lambda-extensions');

const {EventDispatcher} = require('./event-dispatcher');

const CLIENT_ID = process.env.CLIENT_ID || 'testUser';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'testPassword';

const DISPATCH_URI = process.env.DISPATCH_URI || 'http://localhost:8080';
const DISPATCH_MIN_BATCH_SIZE = parseInt(process.env.DISPATCH_MIN_BATCH_SIZE || 2);

async function main() {
    const dispatcher = new EventDispatcher(DISPATCH_URI, DISPATCH_MIN_BATCH_SIZE);
    dispatcher.setCredentials({user: CLIENT_ID, password: CLIENT_SECRET});

    const dispatcherHandler = async (events) => {
        await dispatcher.dispatch(events);
    };

    const shutdownHandler = async() => {
        await dispatcher.flush();
        process.exit(0);
    };

    process.on('SIGINT', shutdownHandler);
    process.on('SIGTERM', shutdownHandler);

    const telemetry = new TelemetryExtension();
    telemetry.bind(TelemetryExtension.EventType.PLATFORM, dispatcherHandler);
    telemetry.bind(Extension.EventType.SHUTDOWN, shutdownHandler);
    await telemetry.run();
}

main();