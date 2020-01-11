"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StatusFactory_1 = __importDefault(require("./factory/StatusFactory"));
var NullResult_1 = __importDefault(require("./result/NullResult"));
var JsonResult_1 = __importDefault(require("./result/JsonResult"));
var HiveOperation = /** @class */ (function () {
    function HiveOperation(driver, operationHandle, TCLIService_type) {
        this.maxRows = 100;
        this.fetchType = 0;
        this._hasMoreRows = false;
        this.hasResultSet = false;
        this.driver = driver;
        this.operationHandle = operationHandle;
        this.TCLIService_type = TCLIService_type;
        this.statusFactory = new StatusFactory_1.default(TCLIService_type);
        this.state = TCLIService_type.TOperationState.INITIALIZED_STATE;
        this.schema = null;
        this.data = [];
    }
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
    HiveOperation.prototype.status = function (progress) {
        var _this = this;
        if (progress === void 0) { progress = false; }
        return this.driver.getOperationStatus({
            operationHandle: this.operationHandle,
            getProgressUpdate: progress
        }).then(function (response) {
            var status = _this.statusFactory.create(response.status);
            if (status.error()) {
                return Promise.reject(status.getError());
            }
            _this.state = response.operationState === undefined
                ? _this.state
                : response.operationState;
            _this.hasResultSet = !!response.hasResultSet;
            return response;
        });
    };
    HiveOperation.prototype.cancel = function () {
        var _this = this;
        return this.driver.cancelOperation({
            operationHandle: this.operationHandle
        }).then(function (response) {
            return _this.statusFactory.create(response.status);
        });
    };
    HiveOperation.prototype.close = function () {
        var _this = this;
        return this.driver.closeOperation({
            operationHandle: this.operationHandle
        }).then(function (response) {
            return _this.statusFactory.create(response.status);
        });
    };
    HiveOperation.prototype.waitUntilReady = function (progress, callback) {
        var _this = this;
        return this.status(progress).then(function (response) {
            var error = null;
            var next = false;
            switch (response.operationState) {
                case _this.TCLIService_type.TOperationState.INITIALIZED_STATE:
                    next = true;
                    break;
                case _this.TCLIService_type.TOperationState.RUNNING_STATE:
                    next = true;
                    break;
                case _this.TCLIService_type.TOperationState.FINISHED_STATE:
                    break;
                case _this.TCLIService_type.TOperationState.CANCELED_STATE:
                    error = new Error('The operation was canceled by a client');
                    break;
                case _this.TCLIService_type.TOperationState.CLOSED_STATE:
                    error = new Error('The operation was closed by a client');
                    break;
                case _this.TCLIService_type.TOperationState.ERROR_STATE:
                    error = new Error('The operation failed due to an error');
                    break;
                case _this.TCLIService_type.TOperationState.PENDING_STATE:
                    error = new Error('The operation is in a pending state');
                    break;
                case _this.TCLIService_type.TOperationState.TIMEDOUT_STATE:
                    error = new Error('The operation is in a timedout state');
                    break;
                case _this.TCLIService_type.TOperationState.UKNOWN_STATE:
                default:
                    error = new Error('The operation is in an unrecognized state');
                    break;
            }
            return _this.executeCallback(callback.bind(null, error, response)).then(function () {
                if (error) {
                    return Promise.reject(error);
                }
                else if (next) {
                    return _this.waitUntilReady(progress, callback);
                }
            });
        }).then(function () {
            return _this;
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
    HiveOperation.prototype.result = function (resultHandler) {
        if (this.schema === null) {
            return new NullResult_1.default();
        }
        if (!resultHandler) {
            resultHandler = new JsonResult_1.default(this.TCLIService_type);
        }
        resultHandler.setSchema(this.schema);
        resultHandler.setData(this.data);
        return resultHandler;
    };
    HiveOperation.prototype.getQueryId = function () {
        return this.driver.getQueryId({
            operationHandle: this.operationHandle
        }).then(function (response) {
            return response.queryId;
        });
    };
    HiveOperation.prototype.initializeSchema = function () {
        var _this = this;
        return this.driver.getResultSetMetadata({
            operationHandle: this.operationHandle
        }).then(function (schema) {
            var status = _this.statusFactory.create(schema.status);
            if (status.error()) {
                return Promise.reject(status.getError());
            }
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
    HiveOperation.prototype.processFetchResponse = function (response) {
        var status = this.statusFactory.create(response.status);
        if (status.error()) {
            throw status.getError();
        }
        this._hasMoreRows = !!response.hasMoreRows;
        if (response.results) {
            this.data.push(response.results);
        }
        return status;
    };
    HiveOperation.prototype.executeCallback = function (callback) {
        var result = callback();
        if (result instanceof Promise) {
            return result;
        }
        else {
            return Promise.resolve(result);
        }
    };
    return HiveOperation;
}());
exports.default = HiveOperation;
//# sourceMappingURL=HiveOperation.js.map