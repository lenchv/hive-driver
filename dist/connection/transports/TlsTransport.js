"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tls = require('tls');
const constants = require('constants');
class TlsTransport {
    host;
    port;
    connection;
    tlsOptions;
    options;
    tls;
    constructor(host, port, options = {}) {
        this.tls = tls;
        this.host = host;
        this.port = port;
        this.tlsOptions = {
            secureProtocol: 'SSLv23_method',
            secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3,
            rejectUnauthorized: false,
            ca: options?.ca,
            cert: options?.cert,
            key: options?.key,
            ...options
        };
        this.options = {};
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
    getTransport() {
        return this.connection;
    }
    connect() {
        this.connection = this.tls.connect(this.port, this.host, this.tlsOptions);
        this.connection.setMaxSendFragment(65536);
        this.connection.setNoDelay(true);
    }
    ;
    addListener(eventName, listener) {
        if (eventName === 'connect') {
            return this.connection.addListener('secureConnect', listener);
        }
        else {
            return this.connection.addListener(eventName, listener);
        }
    }
    removeListener(eventName, listener) {
        if (eventName === 'connect') {
            return this.connection.removeListener('secureConnect', listener);
        }
        else {
            return this.connection.removeListener(eventName, listener);
        }
    }
    write(data) {
        return this.connection.write(data);
    }
    end() {
        return this.connection.end();
    }
    emit(eventName) {
        if (eventName === 'connect') {
            this.connection.emit('secureConnect');
        }
        else {
            this.connection.emit(eventName);
        }
    }
}
exports.default = TlsTransport;
//# sourceMappingURL=TlsTransport.js.map