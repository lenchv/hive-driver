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
Object.defineProperty(exports, "__esModule", { value: true });
var HiveOperation_1 = __importDefault(require("./HiveOperation"));
var InfoResponse_1 = __importDefault(require("./responses/InfoResponse"));
var StatusFactory_1 = __importDefault(require("./factory/StatusFactory"));
var HiveSession = /** @class */ (function () {
    function HiveSession(driver, sessionHandle, TCLIService_types) {
        this.driver = driver;
        this.sessionHandle = sessionHandle;
        this.TCLIService_types = TCLIService_types;
        this.statusFactory = new StatusFactory_1.default(TCLIService_types);
    }
    /**
     * @param infoType one of the values TCLIService_types.TGetInfoType
     */
    HiveSession.prototype.getInfo = function (infoType) {
        var _this = this;
        return this.driver.getInfo({
            sessionHandle: this.sessionHandle,
            infoType: infoType
        }).then(function (response) {
            return new InfoResponse_1.default(response, _this.TCLIService_types);
        });
    };
    HiveSession.prototype.executeStatement = function (statement, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        options = __assign({ runAsync: false }, options);
        return this.driver.executeStatement(__assign({ sessionHandle: this.sessionHandle, statement: statement }, options)).then(function (response) {
            var status = _this.statusFactory.create(response.status);
            if (status.error()) {
                return Promise.reject(status.getError());
            }
            var operation = new HiveOperation_1.default(_this.driver, response.operationHandle, _this.TCLIService_types);
            return operation;
        });
    };
    // getTypeInfo(): IOperation {
    // }
    // getCatalogs(): IOperation {
    // }
    // getSchemas(): IOperation {
    // }
    // getTables(): IOperation {
    // }
    // getTableTypes(): IOperation {
    // }
    // getColumns(): IOperation {
    // }
    // getFunctions(functionName: string): IOperation {
    // }
    // getPrimaryKeys(dbName: string, tableName: string): IOperation {
    // }
    // getCrossReference(request: CrossReferenceRequest): IOperation {
    // }
    // getDelegationToken(owner: string, renewer: string): string {
    // }
    // cancelDelegationToken(token: string): Status {
    // }
    // renewDelegationToken(token: string): Status {
    // }
    HiveSession.prototype.close = function () {
        var _this = this;
        return this.driver.closeSession({
            sessionHandle: this.sessionHandle
        }).then(function (response) {
            return _this.statusFactory.create(response.status);
        });
    };
    return HiveSession;
}());
exports.default = HiveSession;
//# sourceMappingURL=HiveSession.js.map