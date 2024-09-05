#!/usr/bin/env node

/**
 * This extension collects system metrics (CPU and memory) and print them in the console everytime a function is invoked.
 *
 */

const os = require('os');
const {Extension} = require('toolkit-for-aws-lambda-extensions');

async function main() {

    const logMetrics = () => {
        console.log(getSystemMetrics());
    }

    const extension = new Extension();
    extension.bind(Extension.EventType.INVOKE, logMetrics);

    await extension.run();
}

function getSystemMetrics() {
    return {
        cpu: os.cpus().map(cpu => cpu.times),
        memory: {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem()
        }
    }
}

main();