"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require('net');
class TcpTransport {
    host;
    port;
    options;
    connection;
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.options = {};
    }
    getTransport() {
        return this.connection;
    }
    setOptions(option, value) {
        this.options = {
            ...this.options,
            [option]: value
        };
    }
    getOptions() {
        return this.options;
    }
    connect() {
        this.connection = net.createConnection(this.port, this.host);
    }
    ;
    addListener(eventName, listener) {
        return this.connection.addListener(eventName, listener);
    }
    removeListener(eventName, listener) {
        return this.connection.removeListener(eventName, listener);
    }
    write(data) {
        return this.connection.write(data);
    }
    end() {
        return this.connection.end();
    }
    emit(eventName) {
        this.connection.emit(eventName);
    }
}
exports.default = TcpTransport;
//# sourceMappingURL=TcpTransport.js.map