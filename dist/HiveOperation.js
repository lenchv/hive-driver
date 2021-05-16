"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("./hive/Types");
var StatusFactory_1 = __importDefault(require("./factory/StatusFactory"));
var HiveOperation = /** @class */ (function () {
    function HiveOperation(driver, operationHandle, TCLIService_type) {
        this.maxRows = 100;
        this.fetchType = 0;
        this._hasMoreRows = false;
        this.hasResultSet = false;
        this.driver = driver;
        this.operationHandle = operationHandle;
        this.hasResultSet = operationHandle.hasResultSet;
        this.TCLIService_type = TCLIService_type;
        this.statusFactory = new StatusFactory_1.default(TCLIService_type);
        this.state = TCLIService_type.TOperationState.INITIALIZED_STATE;
        this.schema = null;
        this.data = [];
    }
    /**
     * Fetches result and schema from operation
     * @throws {StatusError}
     */
    HiveOperation.prototype.fetch = function () {
        var _this = this;
        if (!this.hasResultSet) {
            return Promise.resolve(this.statusFactory.create({
                statusCode: this.TCLIService_type.TStatusCode.SUCCESS_STATUS
            }));
        }
        if (!this.finished()) {
            return Promise.resolve(this.statusFactory.create({
                statusCode: this.TCLIService_type.TStatusCode.STILL_EXECUTING_STATUS
            }));
        }
        if (this.schema === null) {
            return this.initializeSchema().then(function (schema) {
                _this.schema = schema;
                return _this.firstFetch();
            }).then(function (response) { return _this.processFetchResponse(response); });
        }
        else {
            return this.nextFetch().then(function (response) { return _this.processFetchResponse(response); });
        }
    };
    /**
     * Requests operation status
     * @param progress
     * @throws {StatusError}
     */
    HiveOperation.prototype.status = function (progress) {
        var _this = this;
        if (progress === void 0) { progress = false; }
        return this.driver.getOperationStatus({
            operationHandle: this.operationHandle,
            getProgressUpdate: progress
        }).then(function (response) {
            var _a;
            _this.statusFactory.create(response.status);
            _this.state = (_a = response.operationState) !== null && _a !== void 0 ? _a : _this.state;
            if (typeof response.hasResultSet === 'boolean') {
                _this.hasResultSet = response.hasResultSet;
            }
            return response;
        });
    };
    /**
     * Cancels operation
     * @throws {StatusError}
     */
    HiveOperation.prototype.cancel = function () {
        var _this = this;
        return this.driver.cancelOperation({
            operationHandle: this.operationHandle
        }).then(function (response) {
            return _this.statusFactory.create(response.status);
        });
    };
    /**
     * Closes operation
     * @throws {StatusError}
     */
    HiveOperation.prototype.close = function () {
        var _this = this;
        return this.driver.closeOperation({
            operationHandle: this.operationHandle
        }).then(function (response) {
            return _this.statusFactory.create(response.status);
        });
    };
    HiveOperation.prototype.finished = function () {
        return this.state === this.TCLIService_type.TOperationState.FINISHED_STATE;
    };
    HiveOperation.prototype.hasMoreRows = function () {
        return this._hasMoreRows;
    };
    HiveOperation.prototype.setMaxRows = function (maxRows) {
        this.maxRows = maxRows;
    };
    HiveOperation.prototype.setFetchType = function (fetchType) {
        this.fetchType = fetchType;
    };
    HiveOperation.prototype.getSchema = function () {
        return this.schema;
    };
    HiveOperation.prototype.getData = function () {
        return this.data;
    };
    HiveOperation.prototype.getQueryId = function () {
        return this.driver.getQueryId({
            operationHandle: this.operationHandle
        }).then(function (response) {
            return response.queryId;
        });
    };
    /**
     * Resets `this.data` buffer.
     * Needs to be called when working with massive data.
     */
    HiveOperation.prototype.flush = function () {
        this.data = [];
    };
    /**
     * Retrieves schema
     * @throws {StatusError}
     */
    HiveOperation.prototype.initializeSchema = function () {
        var _this = this;
        return this.driver.getResultSetMetadata({
            operationHandle: this.operationHandle
        }).then(function (schema) {
            _this.statusFactory.create(schema.status);
            return schema.schema;
        });
    };
    HiveOperation.prototype.firstFetch = function () {
        return this.driver.fetchResults({
            operationHandle: this.operationHandle,
            orientation: this.TCLIService_type.TFetchOrientation.FETCH_FIRST,
            maxRows: this.maxRows,
            fetchType: this.fetchType,
        });
    };
    HiveOperation.prototype.nextFetch = function () {
        return this.driver.fetchResults({
            operationHandle: this.operationHandle,
            orientation: this.TCLIService_type.TFetchOrientation.FETCH_NEXT,
            maxRows: this.maxRows,
            fetchType: this.fetchType,
        });
    };
    /**
     * @param response
     * @throws {StatusError}
     */
    HiveOperation.prototype.processFetchResponse = function (response) {
        var status = this.statusFactory.create(response.status);
        this._hasMoreRows = this.checkIfOperationHasMoreRows(response);
        if (response.results) {
            this.data.push(response.results);
        }
        return status;
    };
    HiveOperation.prototype.checkIfOperationHasMoreRows = function (response) {
        var _a, _b;
        if (response.hasMoreRows) {
            return true;
        }
        var columns = ((_a = response.results) === null || _a === void 0 ? void 0 : _a.columns) || [];
        if (!columns.length) {
            return false;
        }
        var column = columns[0];
        var columnValue = column[Types_1.ColumnCode.binaryVal]
            || column[Types_1.ColumnCode.boolVal]
            || column[Types_1.ColumnCode.byteVal]
            || column[Types_1.ColumnCode.doubleVal]
            || column[Types_1.ColumnCode.i16Val]
            || column[Types_1.ColumnCode.i32Val]
            || column[Types_1.ColumnCode.i64Val]
            || column[Types_1.ColumnCode.stringVal];
        return ((_b = columnValue === null || columnValue === void 0 ? void 0 : columnValue.values) === null || _b === void 0 ? void 0 : _b.length) > 0;
    };
    return HiveOperation;
}());
exports.default = HiveOperation;
//# sourceMappingURL=HiveOperation.js.map