"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var thrift = require('thrift');
var HiveDriver_1 = __importDefault(require("./hive/HiveDriver"));
var HiveSession_1 = __importDefault(require("./HiveSession"));
var NoSaslTcpConnection_1 = __importDefault(require("./connection/mechanisms/NoSaslTcpConnection"));
var HiveClient = /** @class */ (function () {
    /**
     *
     * @param TCLIService generated from TCLIService.thrift (https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift)
     * @param TCLIService_types object generated from TCLIService.thrift
     */
    function HiveClient(TCLIService, TCLIService_types) {
        this.TCLIService = TCLIService;
        this.TCLIService_types = TCLIService_types;
        this.client = null;
    }
    HiveClient.prototype.connect = function (options, connectionProvider) {
        var _this = this;
        if (!connectionProvider) {
            connectionProvider = new NoSaslTcpConnection_1.default();
        }
        return connectionProvider
            .connect(options)
            .then(function (connection) {
            _this.client = thrift.createClient(_this.TCLIService, connection.getConnection());
            connection.getConnection().on('close', function (error) {
                throw new Error('Hive: connection was accedentally closed');
            });
            connection.getConnection().on('error', function (error) {
                throw error;
            });
            return _this;
        });
    };
    HiveClient.prototype.openSession = function (request) {
        var _this = this;
        var driver = new HiveDriver_1.default(this.TCLIService_types, this.getClient());
        return driver.openSession(request).then(function (response) {
            if (response.status.statusCode === _this.TCLIService_types.TStatusCode.ERROR_STATUS) {
                throw new Error(response.status.errorMessage);
            }
            var session = new HiveSession_1.default(driver, response.sessionHandle, _this.TCLIService_types);
            return session;
        });
    };
    HiveClient.prototype.getClient = function () {
        if (!this.client) {
            throw new Error('HiveClient: client is not initialized');
        }
        return this.client;
    };
    return HiveClient;
}());
exports.default = HiveClient;
//# sourceMappingURL=HiveClient.js.map