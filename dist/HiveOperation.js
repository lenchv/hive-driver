"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./hive/Types");
const StatusFactory_1 = __importDefault(require("./factory/StatusFactory"));
class HiveOperation {
    driver;
    operationHandle;
    TCLIService_type;
    schema;
    data;
    statusFactory;
    maxRows = 100;
    fetchType = 0;
    _hasMoreRows = false;
    state;
    hasResultSet = false;
    constructor(driver, operationHandle, TCLIService_type) {
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
    fetch(orientation) {
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
            return this.initializeSchema().then((schema) => {
                this.schema = schema;
                if (orientation === Types_1.FetchOrientation.FETCH_NEXT) {
                    return this.nextFetch();
                }
                else {
                    return this.firstFetch();
                }
            }).then(response => this.processFetchResponse(response));
        }
        else {
            return this.nextFetch().then(response => this.processFetchResponse(response));
        }
    }
    /**
     * Requests operation status
     * @param progress
     * @throws {StatusError}
     */
    status(progress = false) {
        return this.driver.getOperationStatus({
            operationHandle: this.operationHandle,
            getProgressUpdate: progress
        }).then((response) => {
            this.statusFactory.create(response.status);
            this.state = response.operationState ?? this.state;
            if (typeof response.hasResultSet === 'boolean') {
                this.hasResultSet = response.hasResultSet;
            }
            return response;
        });
    }
    /**
     * Cancels operation
     * @throws {StatusError}
     */
    cancel() {
        return this.driver.cancelOperation({
            operationHandle: this.operationHandle
        }).then(response => {
            return this.statusFactory.create(response.status);
        });
    }
    /**
     * Closes operation
     * @throws {StatusError}
     */
    close() {
        return this.driver.closeOperation({
            operationHandle: this.operationHandle
        }).then(response => {
            return this.statusFactory.create(response.status);
        });
    }
    finished() {
        return this.state === this.TCLIService_type.TOperationState.FINISHED_STATE;
    }
    hasMoreRows() {
        return this._hasMoreRows;
    }
    setMaxRows(maxRows) {
        this.maxRows = maxRows;
    }
    setFetchType(fetchType) {
        this.fetchType = fetchType;
    }
    getSchema() {
        return this.schema;
    }
    getData() {
        return this.data;
    }
    getQueryId() {
        return this.driver.getQueryId({
            operationHandle: this.operationHandle
        }).then((response) => {
            return response.queryId;
        });
    }
    /**
     * Resets `this.data` buffer.
     * Needs to be called when working with massive data.
     */
    flush() {
        this.data = [];
    }
    /**
     * Retrieves schema
     * @throws {StatusError}
     */
    initializeSchema() {
        return this.driver.getResultSetMetadata({
            operationHandle: this.operationHandle
        }).then((schema) => {
            this.statusFactory.create(schema.status);
            return schema.schema;
        });
    }
    firstFetch() {
        return this.driver.fetchResults({
            operationHandle: this.operationHandle,
            orientation: this.TCLIService_type.TFetchOrientation.FETCH_FIRST,
            maxRows: this.maxRows,
            fetchType: this.fetchType,
        });
    }
    nextFetch() {
        return this.driver.fetchResults({
            operationHandle: this.operationHandle,
            orientation: this.TCLIService_type.TFetchOrientation.FETCH_NEXT,
            maxRows: this.maxRows,
            fetchType: this.fetchType,
        });
    }
    /**
     * @param response
     * @throws {StatusError}
     */
    processFetchResponse(response) {
        const status = this.statusFactory.create(response.status);
        this._hasMoreRows = this.checkIfOperationHasMoreRows(response);
        if (response.results) {
            this.data.push(response.results);
        }
        return status;
    }
    checkIfOperationHasMoreRows(response) {
        if (response.hasMoreRows) {
            return true;
        }
        const columns = response.results?.columns || [];
        if (!columns.length) {
            return false;
        }
        const column = columns[0];
        const columnValue = column[Types_1.ColumnCode.binaryVal]
            || column[Types_1.ColumnCode.boolVal]
            || column[Types_1.ColumnCode.byteVal]
            || column[Types_1.ColumnCode.doubleVal]
            || column[Types_1.ColumnCode.i16Val]
            || column[Types_1.ColumnCode.i32Val]
            || column[Types_1.ColumnCode.i64Val]
            || column[Types_1.ColumnCode.stringVal];
        return columnValue?.values?.length > 0;
    }
}
exports.default = HiveOperation;
//# sourceMappingURL=HiveOperation.js.map