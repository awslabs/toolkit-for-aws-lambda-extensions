/**
 * Utility class Map class using a Regex expression as key and handler function as value.
 *
 * @class
 */
class RegexHandlerMap {
    map = new Map();

    add(regex, handler) {
        this.map.set(regex, handler);
    }

    /**
     *
     * @param path
     * @return {{handler: function, params: object}}
     */
    getHandler(path) {
        for(const [regex, handler] of this.map.entries()) {
            const match = path.match(regex);
            if(match) {
                return {handler: handler, params: match.groups};
            }
        }
    }
}

module.exports = {RegexHandlerMap};