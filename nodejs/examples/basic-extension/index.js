#!/usr/bin/env node

/**
 * This is a primitive Extension example.
 * It receives extension events and print them in the console.
 *
 */

const {Extension} = require('@aws/toolkit-for-aws-lambda-extensions');

async function main() {
    const extension = new Extension();
    extension.bind(Extension.EventType.INVOKE, event => console.log(event));
    await extension.run();
}

main();