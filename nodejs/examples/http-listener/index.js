/**
 * This is not an Extension example.
 *
 * It's an HTTP Listener application for testing and debugging.
 *
 */

const {HttpListener} = require('@aws/toolkit-for-aws-lambda-extensions/http/http-listener');
const {HttpResponse} = require('@aws/toolkit-for-aws-lambda-extensions/http/http-response');

const HOST = 'localhost';
const PORT = 8080;

async function main() {
    const httpListener = new HttpListener(HOST, PORT);

    httpListener.on('POST', (body) => {
        console.dir(JSON.parse(body), {depth: null, colors: true});
    });

    httpListener.on('GET', (body, properties) => {
        console.dir(properties, {depth: null, colors: true});
        const response = new HttpResponse(
            200,
            {message: 'Hello World'},
            {
                firstHeader: 'value1',
                secondHeader: 'value2'
            }
        );

        return response;
    });

    httpListener.start();
}

main();