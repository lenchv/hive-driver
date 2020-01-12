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
     * Returns general information about the data source
     *
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
    /**
     * Executes DDL/DML statements
     *
     * @param statement DDL/DDL statement
     * @param options
     */
    HiveSession.prototype.executeStatement = function (statement, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        options = __assign({ runAsync: false }, options);
        return this.driver.executeStatement(__assign({ sessionHandle: this.sessionHandle, statement: statement }, options)).then(function (response) {
            _this.assertStatus(response.status);
            return _this.createOperation(response.operationHandle);
        });
    };
    HiveSession.prototype.getTypeInfo = function () {
        var _this = this;
        return this.driver.getTypeInfo({
            sessionHandle: this.sessionHandle
        }).then(function (response) {
            _this.assertStatus(response.status);
            return _this.createOperation(response.operationHandle);
        });
    };
    HiveSession.prototype.getCatalogs = function () {
        var _this = this;
        return this.driver.getCatalogs({
            sessionHandle: this.sessionHandle
        }).then(function (response) {
            _this.assertStatus(response.status);
            return _this.createOperation(response.operationHandle);
        });
    };
    HiveSession.prototype.getSchemas = function (schemaName, catalogName) {
        var _this = this;
        return this.driver.getSchemas({
            sessionHandle: this.sessionHandle,
            catalogName: catalogName,
            schemaName: schemaName,
        }).then(function (response) {
            _this.assertStatus(response.status);
            return _this.createOperation(response.operationHandle);
        });
    };
    HiveSession.prototype.getTables = function (catalogName, schemaName, tableName, tableTypes) {
        var _this = this;
        return this.driver.getTables({
            sessionHandle: this.sessionHandle,
            catalogName: catalogName,
            schemaName: schemaName,
            tableName: tableName,
            tableTypes: tableTypes,
        }).then(function (response) {
            _this.assertStatus(response.status);
            return _this.createOperation(response.operationHandle);
        });
    };
    HiveSession.prototype.getTableTypes = function () {
        var _this = this;
        return this.driver.getTableTypes({
            sessionHandle: this.sessionHandle,
        }).then(function (response) {
            _this.assertStatus(response.status);
            return _this.createOperation(response.operationHandle);
        });
    };
    HiveSession.prototype.getColumns = function (catalogName, schemaName, tableName, columnName) {
        var _this = this;
        return this.driver.getColumns({
            sessionHandle: this.sessionHandle,
            catalogName: catalogName,
            schemaName: schemaName,
            tableName: tableName,
            columnName: columnName,
        }).then(function (response) {
            _this.assertStatus(response.status);
            return _this.createOperation(response.operationHandle);
        });
    };
    HiveSession.prototype.getFunctions = function (functionName, catalogName, schemaName) {
        var _this = this;
        return this.driver.getFunctions({
            sessionHandle: this.sessionHandle,
            functionName: functionName,
            schemaName: schemaName,
            catalogName: catalogName,
        }).then(function (response) {
            _this.assertStatus(response.status);
            return _this.createOperation(response.operationHandle);
        });
    };
    HiveSession.prototype.getPrimaryKeys = function (schemaName, tableName, catalogName) {
        var _this = this;
        return this.driver.getPrimaryKeys({
            sessionHandle: this.sessionHandle,
            catalogName: catalogName,
            schemaName: schemaName,
            tableName: tableName,
        }).then(function (response) {
            _this.assertStatus(response.status);
            return _this.createOperation(response.operationHandle);
        });
    };
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
    HiveSession.prototype.createOperation = function (handle) {
        return new HiveOperation_1.default(this.driver, handle, this.TCLIService_types);
    };
    HiveSession.prototype.assertStatus = function (responseStatus) {
        var status = this.statusFactory.create(responseStatus);
        if (status.error()) {
            throw status.getError();
        }
    };
    return HiveSession;
}());
exports.default = HiveSession;
//# sourceMappingURL=HiveSession.js.map