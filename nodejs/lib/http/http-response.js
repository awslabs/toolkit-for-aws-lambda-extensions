/**
 * Class representing an HTTP response.
 * The main purpose is to abstract HTTP client from the implementation
 *
 */
class HttpResponse {

    /**
     *
     * @param statusCode {number}
     * @param body {string|object}
     * @param headers {Map|object}
     */
    constructor(statusCode, body, headers) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = (headers instanceof Map) ? headers:new Map(Object.entries(headers));
        this.ok = statusCode >= 200 && statusCode < 300;
    }

    /**
     * Returns the body of the response as text.
     *
     * @return {string}
     */
    text() {
        return (this.body instanceof Object) ? JSON.stringify(this.body):this.body;
    }

    /**
     * Returns the body of the response as JSON.
     * @return {object}
     */
    json() {
        return (this.body instanceof Object) ? this.body:JSON.parse(this.body);
    }
}

module.exports = {HttpResponse};