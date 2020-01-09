"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Connection = /** @class */ (function () {
    function Connection(connection) {
        this.connection = connection;
    }
    Connection.prototype.getConnection = function () {
        return this.connection;
    };
    Connection.prototype.connect = function () {
        return this.connection.connect();
    };
    ;
    Connection.prototype.addListener = function (eventName, listener) {
        return this.connection.addListener(eventName, listener);
    };
    Connection.prototype.removeListener = function (eventName, listener) {
        return this.connection.removeListener(eventName, listener);
    };
    Connection.prototype.write = function (data) {
        return this.connection.write(data);
    };
    Connection.prototype.end = function () {
        return this.connection.end();
    };
    return Connection;
}());
exports.default = Connection;
//# sourceMappingURL=Connection.js.map