/**
 * Encapsulate an external event received by the extension.
 * Note: Type property will only hold the first part of the event type, e.g. "platform" for "platform.start".
 *
 * @class
 */
class Event {

    /**
     *
     * @param {string} type
     * @param {any} data
     */
    constructor(type, data) {
        this.type = type.split('.')[0];
        this.data = data;
    }

}

module.exports = {Event};

