"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const thrift = require('thrift');
const HiveDriver_1 = __importDefault(require("./hive/HiveDriver"));
const HiveSession_1 = __importDefault(require("./HiveSession"));
const NoSaslAuthentication_1 = __importDefault(require("./connection/auth/NoSaslAuthentication"));
const TcpConnection_1 = __importDefault(require("./connection/connections/TcpConnection"));
const events_1 = require("events");
const StatusFactory_1 = __importDefault(require("./factory/StatusFactory"));
const HiveDriverError_1 = __importDefault(require("./errors/HiveDriverError"));
class HiveClient extends events_1.EventEmitter {
    TCLIService;
    TCLIService_types;
    client;
    connection;
    statusFactory;
    connectionProvider;
    authProvider;
    thrift;
    /**
     *
     * @param TCLIService generated from TCLIService.thrift (https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift)
     * @param TCLIService_types object generated from TCLIService.thrift
     */
    constructor(TCLIService, TCLIService_types) {
        super();
        this.thrift = thrift;
        this.TCLIService = TCLIService;
        this.TCLIService_types = TCLIService_types;
        this.connectionProvider = new TcpConnection_1.default();
        this.authProvider = new NoSaslAuthentication_1.default();
        this.statusFactory = new StatusFactory_1.default(TCLIService_types);
        this.client = null;
        this.connection = null;
    }
    async connect(options, connectionProvider, authProvider) {
        if (connectionProvider) {
            this.connectionProvider = connectionProvider;
        }
        if (authProvider) {
            this.authProvider = authProvider;
        }
        this.connection = await this.connectionProvider.connect(options, this.authProvider);
        this.client = this.thrift.createClient(this.TCLIService, this.connection.getConnection());
        this.connection.getConnection().on('error', (error) => {
            this.emit('error', error);
        });
        this.connection.getConnection().on('reconnecting', (params) => {
            this.emit('reconnecting', params);
        });
        this.connection.getConnection().on('close', () => {
            this.emit('close');
        });
        this.connection.getConnection().on('timeout', () => {
            this.emit('timeout');
        });
        return this;
    }
    /**
     * Starts new session
     *
     * @param request
     * @throws {StatusError}
     */
    openSession(request) {
        if (!this.connection?.isConnected()) {
            return Promise.reject(new HiveDriverError_1.default('HiveClient: connection is lost'));
        }
        const driver = new HiveDriver_1.default(this.TCLIService_types, this.getClient());
        return driver.openSession(request).then((response) => {
            this.statusFactory.create(response.status);
            const session = new HiveSession_1.default(driver, response.sessionHandle, this.TCLIService_types);
            return session;
        });
    }
    getClient() {
        if (!this.client) {
            throw new HiveDriverError_1.default('HiveClient: client is not initialized');
        }
        return this.client;
    }
    close() {
        if (!this.connection) {
            return;
        }
        const thriftConnection = this.connection.getConnection();
        if (typeof thriftConnection.end === 'function') {
            this.connection.getConnection().end();
        }
    }
}
exports.default = HiveClient;
//# sourceMappingURL=HiveClient.js.map