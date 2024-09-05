class EventRouter {

    /**
     * Map: <eventType, handler>
     *
     * @type {Map<string, Function>}
     */
    routes = new Map();

    /**
     * Associate an event type with a handler.
     *
     * @param {string} type
     * @param {Function} handler
     */
    addRoute(type, handler) {
        this.routes.set(type, handler);
    }

    /**
     * Check if a handler is associated with an event type.
     *
     * @param {string} type
     * @param type
     * @return {boolean}
     */
    hasRoute(type) {
        return this.routes.has(type);
    }

    /**
     * Route events to the handler that is subscribed to their type.
     *
     * @param {Event[]} events
     * @return {Promise<Map<string, object>>}
     */
    async route(events) {
        // group events by type
        const eventsByType = new Map();
        for (const event of events) {
            if (this.hasRoute(event.type)) {
                const typeItems = eventsByType.get(event.type) || [];
                if (typeItems.length === 0) {
                    eventsByType.set(event.type, typeItems);
                }
                typeItems.push(event);
            } else {
                console.warn(`[event-router] Discarding event. Event type ${event.type} has no routes`);
            }
        }

        // route events to handlers
        const responseByType = new Map();
        for (const [type, events] of eventsByType) {
            const handler = this.routes.get(type);
            const response = await handler(events);
            responseByType.set(type, response);
        }

        return responseByType;
    }
}

module.exports = {EventRouter};