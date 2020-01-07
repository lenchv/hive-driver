"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ThriftService_1 = __importDefault(require("./hive/ThriftService"));
var ExecuteStatementResponse_1 = __importDefault(require("./ExecuteStatementResponse"));
var HiveClient = /** @class */ (function () {
    function HiveClient(parameters) {
        var TCLIService = parameters.TCLIService, TCLIService_types = parameters.TCLIService_types, protocol = parameters.protocol, connectionOptions = parameters.connectionOptions;
        this.thriftService = new ThriftService_1["default"](TCLIService, TCLIService_types, protocol);
        this.connectionOptions = connectionOptions;
        this.session = null;
        this.connection = null;
    }
    HiveClient.prototype.connect = function (connectionProvider) {
        var _this = this;
        return connectionProvider
            .connect(this.connectionOptions)
            .then(function (connection) {
            _this.connection = connection;
            _this.thriftService.createClient(connection.getConnection());
            return _this.thriftService.getClient();
        });
    };
    HiveClient.prototype.openSession = function (configuration) {
        var _this = this;
        var _a, _b;
        return this.thriftService.openSession({
            username: (_a = this.connectionOptions.options) === null || _a === void 0 ? void 0 : _a.username,
            password: (_b = this.connectionOptions.options) === null || _b === void 0 ? void 0 : _b.password,
            configuration: configuration
        }).then(function (session) {
            _this.session = session;
            return session;
        });
    };
    HiveClient.prototype.execute = function (statement, options) {
        var _this = this;
        return this.thriftService.executeStatement(this.getSession(), statement, options || {}).then(function (response) {
            var result = new ExecuteStatementResponse_1["default"](response, _this.thriftService);
            return result.create();
        });
    };
    HiveClient.prototype.getSession = function () {
        if (this.session === null) {
            throw new Error('session is not initialized. Execute "openSession" to initialize session.');
        }
        return this.session;
    };
    return HiveClient;
}());
exports["default"] = HiveClient;
