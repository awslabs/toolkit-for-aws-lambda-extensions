#!/usr/bin/env node

/**
 * Proxy Extension that discard requests with SQL Injection (OR 1=1) and masks function response with SSN (nnn-nnn-
 */

const {ProxyExtension} = require('@aws/toolkit-for-aws-lambda-extensions');

const SSN_PATTERN = /(\d{3})-(\d{3})-(\d{4})/g;

async function main() {

    const incomingEventHandler = async (events) => {
        console.log('Inspecting incoming request...');

        const httpEvent = events[0].data;
        const functionEvent = JSON.parse(httpEvent.body);

        // SQL Injection Filter
        const functionEventBody = JSON.stringify(functionEvent.body);
        if(functionEventBody.toUpperCase().includes('OR 1=1')) {
            console.log('Dropping event -> SQL Injection detected!')
            // discard event
            return null;
        }

        // Add header to function event
        functionEvent.headers['X-Lambda-Proxy-Extension-Inspected'] = 'true';
        // update the incoming event
        httpEvent.body = functionEvent;

        return httpEvent;
    };

    const functionResponseHandler = async (events) => {
        console.log('Inspecting function response...');

        const functionEvent = events[0].data;
        const strBody = JSON.stringify(functionEvent.body);

        // Masks SSN
        const sanitizedBody = strBody.replaceAll(SSN_PATTERN, (match, p1, p2, p3) => '***-***-'+p3);
        functionEvent.body = JSON.parse(sanitizedBody);

        return functionEvent;
    };

    const proxy = new ProxyExtension();
    proxy.bind(ProxyExtension.EventType.INCOMING_EVENT, incomingEventHandler);
    proxy.bind(ProxyExtension.EventType.FUNCTION_RESPONSE, functionResponseHandler);
    await proxy.run();
}

main();