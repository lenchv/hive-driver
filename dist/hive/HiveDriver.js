"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var OpenSessionCommand_1 = __importDefault(require("./Commands/OpenSessionCommand"));
var CloseSessionCommand_1 = __importDefault(require("./Commands/CloseSessionCommand"));
var ExecuteStatementCommand_1 = __importDefault(require("./Commands/ExecuteStatementCommand"));
var thrift = require('thrift');
var HiveDriver = /** @class */ (function () {
    function HiveDriver(TCLIService, TCLIService_types) {
        this.TCLIService = TCLIService;
        this.TCLIService_types = TCLIService_types;
        this._client = null;
    }
    HiveDriver.prototype.createClient = function (connection) {
        this._client = thrift.createClient(this.TCLIService, connection.getConnection());
        return this;
    };
    HiveDriver.prototype.openSession = function (request) {
        var action = new OpenSessionCommand_1["default"](this.getClient(), this.TCLIService_types);
        return action.execute(request);
    };
    HiveDriver.prototype.closeSession = function (request) {
        var command = new CloseSessionCommand_1["default"](this.getClient(), this.TCLIService_types);
        return command.execute(request);
    };
    HiveDriver.prototype.executeStatement = function (request) {
        var command = new ExecuteStatementCommand_1["default"](this.getClient(), this.TCLIService_types);
        return command.execute(request);
    };
    HiveDriver.prototype.getClient = function () {
        if (!this._client) {
            throw new Error('HiveDriver: client is not initialized');
        }
        return this._client;
    };
    return HiveDriver;
}());
exports["default"] = HiveDriver;
