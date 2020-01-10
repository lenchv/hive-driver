"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StatusFactory_1 = __importDefault(require("./factory/StatusFactory"));
var OperationResult_1 = __importDefault(require("./dto/OperationResult"));
var Operation = /** @class */ (function () {
    function Operation(driver, operationHandle, TCLIService_type) {
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
    Operation.prototype.fetch = function () {
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
        else if (this.hasMoreRows()) {
            return this.nextFetch().then(this.processFetchResponse);
        }
        else {
            var status_1 = this.statusFactory.create({
                statusCode: this.TCLIService_type.TStatusCode.SUCCESS_STATUS
            });
            return Promise.resolve(status_1);
        }
    };
    Operation.prototype.status = function (progress) {
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
    Operation.prototype.cancel = function () {
        var _this = this;
        return this.driver.cancelOperation({
            operationHandle: this.operationHandle
        }).then(function (response) {
            return _this.statusFactory.create(response.status);
        });
    };
    Operation.prototype.close = function () {
        var _this = this;
        return this.driver.closeOperation({
            operationHandle: this.operationHandle
        }).then(function (response) {
            return _this.statusFactory.create(response.status);
        });
    };
    Operation.prototype.waitUntilReady = function (progress, callback) {
        var _this = this;
        this.status(progress).then(function (response) {
            switch (response.operationState) {
                case _this.TCLIService_type.TOperationState.INITIALIZED_STATE:
                    callback(null, response);
                    return _this.waitUntilReady(progress, callback);
                case _this.TCLIService_type.TOperationState.RUNNING_STATE:
                    callback(null, response);
                    return _this.waitUntilReady(progress, callback);
                case _this.TCLIService_type.TOperationState.FINISHED_STATE:
                    return callback(null, response);
                case _this.TCLIService_type.TOperationState.CANCELED_STATE:
                    return callback(new Error('The operation was canceled by a client'), response);
                case _this.TCLIService_type.TOperationState.CLOSED_STATE:
                    return callback(new Error('The operation was closed by a client'), response);
                case _this.TCLIService_type.TOperationState.ERROR_STATE:
                    return callback(new Error('The operation failed due to an error'), response);
                case _this.TCLIService_type.TOperationState.PENDING_STATE:
                    return callback(new Error('The operation is in an pending state'), response);
                case _this.TCLIService_type.TOperationState.TIMEDOUT_STATE:
                    return callback(new Error('The operation is in an timedout state'), response);
                case _this.TCLIService_type.TOperationState.UKNOWN_STATE:
                default:
                    return callback(new Error('The operation is in an unrecognized state'), response);
            }
        }, function (error) {
            callback(error);
        });
    };
    Operation.prototype.finished = function () {
        return this.state === this.TCLIService_type.TOperationState.FINISHED_STATE;
    };
    Operation.prototype.hasMoreRows = function () {
        return this._hasMoreRows;
    };
    Operation.prototype.setMaxRows = function (maxRows) {
        this.maxRows = maxRows;
    };
    Operation.prototype.setFetchType = function (fetchType) {
        this.fetchType = fetchType;
    };
    Operation.prototype.result = function () {
        if (this.schema === null) {
            return null;
        }
        return new OperationResult_1.default(this.schema, this.data, this.TCLIService_type);
    };
    Operation.prototype.initializeSchema = function () {
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
    Operation.prototype.firstFetch = function () {
        return this.driver.fetchResults({
            operationHandle: this.operationHandle,
            orientation: this.TCLIService_type.TFetchOrientation.FETCH_FIRST,
            maxRows: this.maxRows,
            fetchType: this.fetchType,
        });
    };
    Operation.prototype.nextFetch = function () {
        return this.driver.fetchResults({
            operationHandle: this.operationHandle,
            orientation: this.TCLIService_type.TFetchOrientation.FETCH_NEXT,
            maxRows: this.maxRows,
            fetchType: this.fetchType,
        });
    };
    Operation.prototype.processFetchResponse = function (response) {
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
    return Operation;
}());
exports.default = Operation;
//# sourceMappingURL=Operation.js.map