const http = require('http');
const https = require('https');
const {HttpResponse} = require('./http-response');

/**
 * Utility class to invoke HTTP endpoints.
 * This intends to centralize and abstract the lib/implementation.
 *
 * @class
 */
class HttpClient {

    /**
     *
     * @param {string} url
     * @param {string} method
     * @param {string|object} body
     * @param {object} headers
     * @return {Promise<HttpResponse>}
     */
    static async invoke(url, method, body = '', headers = {}) {
        const client = url.startsWith('https:') ? https : http
        const agent = new client.Agent({
            keepAlive: true,
            timeout: 5000
        });

        if(!headers['content-type']) { headers['content-type'] = 'application/json'; }

        return new Promise((resolve, reject) => {
            const request = client.request(
                url,
                {method: method, headers: headers, agent: agent},
                (response) => {
                    const buffer = [];

                    response.on('data', chunk => buffer.push(chunk));
                    response.on('error', (err) => reject(err));
                    response.on('end', () => {
                        const httpResponse = new HttpResponse(
                            response.statusCode,
                            buffer.toString(),
                            response.headers);

                        resolve(httpResponse);
                    });
                });

            request.on('error', (err) => {
                reject(err);
            });

            request.setNoDelay(true);

            if (body) {
                request.write(body instanceof String ? body : JSON.stringify(body));
            }

            request.end();
        });
    }
}

/**
 * Represents an HTTP response.
 *
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Response
 *
 * @class
 */
/*
class Response {
    buffer = [];

    constructor(response) {
        this.body = new Promise((resolve, reject) => {
            response.on('data', chunk => this.buffer.push(chunk));
            response.on('end', () => resolve(this.buffer));
            response.on('error', (err) => reject(err));
        });

        this.status = response.statusCode;
        this.headers = new Map(Object.entries(response.headers));
        this.ok = response.statusCode >= 200 && response.statusCode < 300;
    }

    /!**
     * Returns the body of the response as text.
     * @return {Promise<string>}
     *!/
    async text() {
        const response = await this.body;
        return response.toString();
    }

    /!**
     * Returns the body of the response as JSON.
     * @return {Promise<object>}
     *!/
    async json() {
        const response = await this.text();
        return JSON.parse(response);
    }
}
*/

module.exports = {HttpClient};