"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var FetchResult_1 = __importDefault(require("./Commands/FetchResult"));
var thrift = require('thrift');
var ThriftService = /** @class */ (function () {
    function ThriftService(TCLIService, TCLIService_types, protocol) {
        this.TCLIService = TCLIService;
        this.TCLIService_types = TCLIService_types;
        this.protocol = protocol || this.getTheLatestProtocol();
        this.client = null;
    }
    ThriftService.prototype.createClient = function (connection) {
        this.client = thrift.createClient(this.TCLIService, connection.getConnection());
        return this.client;
    };
    ThriftService.prototype.openSession = function (parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = new _this.TCLIService_types.TOpenSessionReq(_this.setIfDefined(__assign({ client_protocol: _this.protocol }, parameters)));
            _this.getClient().OpenSession(request, function (err, session) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(session);
                }
            });
        });
    };
    ThriftService.prototype.executeStatement = function (session, statement, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var requestOptions = __assign({ sessionHandle: session.sessionHandle, statement: statement, confOverlay: undefined, runAsync: false, queryTimeout: 100000 }, options);
            var request = new _this.TCLIService_types.TExecuteStatementReq(requestOptions);
            _this.getClient().ExecuteStatement(request, function (err, res) {
                if (err) {
                    reject(err);
                }
                else if (res.status.statusCode === _this.TCLIService_types.TStatusCode.ERROR_STATUS) {
                    reject(new Error(res.status.errorMessage));
                }
                else {
                    resolve(res);
                }
            });
        });
    };
    ThriftService.prototype.fetchResult = function (response, limit) {
        var result = new FetchResult_1["default"](this.TCLIService_types, this.getClient(), response, limit);
        return result.execute();
    };
    ThriftService.prototype.getResultSetMetadata = function (response) {
        var _this = this;
        if (!response.operationHandle) {
            return Promise.reject(new Error('operation handle does not exist'));
        }
        return new Promise(function (resolve, reject) {
            var request = new _this.TCLIService_types.TGetResultSetMetadataReq(response);
            _this.getClient().GetResultSetMetadata(request, function (error, result) {
                error ? reject(error) : resolve(result);
            });
        });
    };
    ThriftService.prototype.getClient = function () {
        if (!this.client) {
            throw new Error('ThriftService: client is not initialized');
        }
        return this.client;
    };
    ThriftService.prototype.getTheLatestProtocol = function () {
        return Number(Object.values(this.TCLIService_types.TProtocolVersion).pop());
    };
    ThriftService.prototype.setIfDefined = function (parameters) {
        return Object.keys(parameters).reduce(function (result, key) {
            var _a;
            if (parameters[key] === undefined) {
                return result;
            }
            else {
                return __assign(__assign({}, result), (_a = {}, _a[key] = parameters[key], _a));
            }
        }, {});
    };
    return ThriftService;
}());
exports["default"] = ThriftService;
