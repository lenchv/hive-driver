"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var thrift = require('thrift');
var HiveDriver_1 = __importDefault(require("./hive/HiveDriver"));
var HiveSession_1 = __importDefault(require("./HiveSession"));
var NoSaslAuthentication_1 = __importDefault(require("./connection/auth/NoSaslAuthentication"));
var TcpConnection_1 = __importDefault(require("./connection/connections/TcpConnection"));
var events_1 = require("events");
var StatusFactory_1 = __importDefault(require("./factory/StatusFactory"));
var HiveDriverError_1 = __importDefault(require("./errors/HiveDriverError"));
var HiveClient = /** @class */ (function (_super) {
    __extends(HiveClient, _super);
    /**
     *
     * @param TCLIService generated from TCLIService.thrift (https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift)
     * @param TCLIService_types object generated from TCLIService.thrift
     */
    function HiveClient(TCLIService, TCLIService_types) {
        var _this = _super.call(this) || this;
        _this.thrift = thrift;
        _this.TCLIService = TCLIService;
        _this.TCLIService_types = TCLIService_types;
        _this.connectionProvider = new TcpConnection_1.default();
        _this.authProvider = new NoSaslAuthentication_1.default();
        _this.statusFactory = new StatusFactory_1.default(TCLIService_types);
        _this.client = null;
        _this.connection = null;
        return _this;
    }
    HiveClient.prototype.connect = function (options, connectionProvider, authProvider) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (connectionProvider) {
                            this.connectionProvider = connectionProvider;
                        }
                        if (authProvider) {
                            this.authProvider = authProvider;
                        }
                        _a = this;
                        return [4 /*yield*/, this.connectionProvider.connect(options, this.authProvider)];
                    case 1:
                        _a.connection = _b.sent();
                        this.client = this.thrift.createClient(this.TCLIService, this.connection.getConnection());
                        this.connection.getConnection().on('error', function (error) {
                            _this.emit('error', error);
                        });
                        this.connection.getConnection().on('reconnecting', function (params) {
                            _this.emit('reconnecting', params);
                        });
                        this.connection.getConnection().on('close', function () {
                            _this.emit('close');
                        });
                        this.connection.getConnection().on('timeout', function () {
                            _this.emit('timeout');
                        });
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Starts new session
     *
     * @param request
     * @throws {StatusError}
     */
    HiveClient.prototype.openSession = function (request) {
        var _this = this;
        var _a;
        if (!((_a = this.connection) === null || _a === void 0 ? void 0 : _a.isConnected())) {
            return Promise.reject(new HiveDriverError_1.default('HiveClient: connection is lost'));
        }
        var driver = new HiveDriver_1.default(this.TCLIService_types, this.getClient());
        return driver.openSession(request).then(function (response) {
            _this.statusFactory.create(response.status);
            var session = new HiveSession_1.default(driver, response.sessionHandle, _this.TCLIService_types);
            return session;
        });
    };
    HiveClient.prototype.getClient = function () {
        if (!this.client) {
            throw new HiveDriverError_1.default('HiveClient: client is not initialized');
        }
        return this.client;
    };
    HiveClient.prototype.close = function () {
        if (!this.connection) {
            return;
        }
        var thriftConnection = this.connection.getConnection();
        if (typeof thriftConnection.end === 'function') {
            this.connection.getConnection().end();
        }
    };
    return HiveClient;
}(events_1.EventEmitter));
exports.default = HiveClient;
//# sourceMappingURL=HiveClient.js.map