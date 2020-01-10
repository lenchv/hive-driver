"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Operation_1 = __importDefault(require("./Operation"));
var InfoResponse_1 = __importDefault(require("./responses/InfoResponse"));
var Status_1 = __importDefault(require("./dto/Status"));
var HiveSession = /** @class */ (function () {
    function HiveSession(driver, sessionHandle, TCLIService_types) {
        this.driver = driver;
        this.sessionHandle = sessionHandle;
        this.TCLIService_types = TCLIService_types;
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
    HiveSession.prototype.executeStatement = function (statement) {
        var _this = this;
        return this.driver.executeStatement({
            sessionHandle: this.sessionHandle,
            runAsync: false,
            statement: statement,
        }).then(function (response) {
            var operation = new Operation_1.default(_this.driver, response.operationHandle);
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
            return new Status_1.default(response.status, _this.TCLIService_types);
        });
    };
    return HiveSession;
}());
exports.default = HiveSession;
//# sourceMappingURL=HiveSession.js.map