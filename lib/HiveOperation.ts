import IOperation from "./contracts/IOperation";
import HiveDriver from "./hive/HiveDriver";
import { OperationHandle, TCLIServiceTypes, TableSchema, RowSet, ColumnCode, Column } from "./hive/Types";
import Status from "./dto/Status";
import { GetOperationStatusResponse } from "./hive/Commands/GetOperationStatusCommand";
import { GetResultSetMetadataResponse } from "./hive/Commands/GetResultSetMetadataCommand";
import { FetchResultsResponse } from "./hive/Commands/FetchResultsCommand";
import StatusFactory from "./factory/StatusFactory";
import { GetQueryIdResponse } from "./hive/Commands/GetQueryIdCommand";

export default class HiveOperation implements IOperation {
    private driver: HiveDriver;
    private operationHandle: OperationHandle;
    private TCLIService_type: TCLIServiceTypes;
    private schema: TableSchema | null;
    private data: Array<RowSet>;
    private statusFactory: StatusFactory;

    private maxRows: number = 100;
    private fetchType: number = 0;

    private _hasMoreRows: boolean = false;
    private state: number;
    private hasResultSet: boolean = false;

    constructor(
        driver: HiveDriver,
        operationHandle: OperationHandle,
        TCLIService_type: TCLIServiceTypes
    ) {
        this.driver = driver;
        this.operationHandle = operationHandle;
        this.hasResultSet = operationHandle.hasResultSet;
        this.TCLIService_type = TCLIService_type;
        this.statusFactory = new StatusFactory(TCLIService_type);
        this.state = TCLIService_type.TOperationState.INITIALIZED_STATE;

        this.schema = null;
        this.data = [];
    }

    /**
     * Fetches result and schema from operation
     * @throws {StatusError}
     */
    fetch(): Promise<Status> {
        if (!this.hasResultSet) {
            return Promise.resolve(
                this.statusFactory.create({
                    statusCode: this.TCLIService_type.TStatusCode.SUCCESS_STATUS
                })
            );
        }

        if (!this.finished()) {
            return Promise.resolve(
                this.statusFactory.create({
                    statusCode: this.TCLIService_type.TStatusCode.STILL_EXECUTING_STATUS
                })
            );
        }

        if (this.schema === null) {
            return this.initializeSchema().then((schema: TableSchema) => {
                this.schema = schema;
    
                return this.firstFetch();
            }).then(
                response => this.processFetchResponse(response)
            );
        } else {
            return this.nextFetch().then(
                response => this.processFetchResponse(response)
            );
        }
    }

    /**
     * Requests operation status
     * @param progress
     * @throws {StatusError}
     */
    status(progress: boolean = false): Promise<GetOperationStatusResponse> {
        return this.driver.getOperationStatus({
            operationHandle: this.operationHandle,
            getProgressUpdate: progress
        }).then((response: GetOperationStatusResponse) => {
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
    cancel(): Promise<Status> {
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
    close(): Promise<Status> {
        return this.driver.closeOperation({
            operationHandle: this.operationHandle
        }).then(response => {
            return this.statusFactory.create(response.status);
        });
    }

    finished(): boolean {
        return this.state === this.TCLIService_type.TOperationState.FINISHED_STATE;
    }

    hasMoreRows(): boolean {
        return this._hasMoreRows;
    }

    setMaxRows(maxRows: number): void {
        this.maxRows = maxRows;
    }

    setFetchType(fetchType: number): void {
        this.fetchType = fetchType;
    }

    getSchema(): TableSchema | null {
        return this.schema;
    }

    getData(): Array<RowSet> {
        return this.data;
    }

    getQueryId(): Promise<string> {
        return this.driver.getQueryId({
            operationHandle: this.operationHandle
        }).then((response: GetQueryIdResponse) => {
            return response.queryId;
        });
    }

    /**
     * Resets `this.data` buffer.
     * Needs to be called when working with massive data.
     */
    flush(): void {
        this.data = [];
    }

    /**
     * Retrieves schema
     * @throws {StatusError}
     */
    private initializeSchema(): Promise<TableSchema> {
        return this.driver.getResultSetMetadata({
            operationHandle: this.operationHandle
        }).then((schema:GetResultSetMetadataResponse) => {
            this.statusFactory.create(schema.status);

            return schema.schema;
        });
    }

    private firstFetch(): Promise<FetchResultsResponse> {
        return this.driver.fetchResults({
            operationHandle: this.operationHandle,
            orientation: this.TCLIService_type.TFetchOrientation.FETCH_FIRST,
            maxRows: this.maxRows,
            fetchType: this.fetchType,
        });
    }

    private nextFetch(): Promise<FetchResultsResponse> {
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
    private processFetchResponse(response: FetchResultsResponse): Status {
        const status = this.statusFactory.create(response.status);

        this._hasMoreRows = this.checkIfOperationHasMoreRows(response);

        if (response.results) {
            this.data.push(response.results);
        }

        return status;
    }

    private checkIfOperationHasMoreRows(response: FetchResultsResponse): boolean {
        if (response.hasMoreRows) {
            return true;
        }

        const columns = response.results?.columns || [];

        if (!columns.length) {
            return false;
        }

        const column: Column = columns[0];

        const columnValue = column[ColumnCode.binaryVal]
            || column[ColumnCode.boolVal]
            || column[ColumnCode.byteVal]
            || column[ColumnCode.doubleVal]
            || column[ColumnCode.i16Val]
            || column[ColumnCode.i32Val]
            || column[ColumnCode.i64Val]
            || column[ColumnCode.stringVal];

        return columnValue?.values?.length > 0;
    }
}
