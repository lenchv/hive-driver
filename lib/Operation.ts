import IOperation from "./contracts/IOperation";
import HiveDriver from "./hive/HiveDriver";
import { OperationHandle, TCLIServiceTypes, TableSchema, RowSet } from "./hive/Types";
import Status from "./dto/Status";
import { GetOperationStatusResponse } from "./hive/Commands/GetOperationStatusCommand";
import { GetResultSetMetadataResponse } from "./hive/Commands/GetResultSetMetadataCommand";
import { FetchResultsResponse } from "./hive/Commands/FetchResultsCommand";
import StatusFactory from "./factory/StatusFactory";
import OperationResult from "./dto/OperationResult";

export default class Operation implements IOperation {
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
        this.TCLIService_type = TCLIService_type;
        this.statusFactory = new StatusFactory(TCLIService_type);
        this.state = TCLIService_type.TOperationState.INITIALIZED_STATE;

        this.schema = null;
        this.data = [];
    }

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
        } else if (this.hasMoreRows()) {
            return this.nextFetch().then(this.processFetchResponse)
        } else {
            const status = this.statusFactory.create({
                statusCode: this.TCLIService_type.TStatusCode.SUCCESS_STATUS
            });

            return Promise.resolve(status);
        }
    }

    status(progress: boolean = false): Promise<GetOperationStatusResponse> {
        return this.driver.getOperationStatus({
            operationHandle: this.operationHandle,
            getProgressUpdate: progress
        }).then((response: GetOperationStatusResponse) => {
            const status = this.statusFactory.create(response.status);

            if (status.error()) {
                return Promise.reject(status.getError());
            }

            this.state = response.operationState === undefined
                ? this.state
                : response.operationState;

            this.hasResultSet = !!response.hasResultSet;

            return response;
        });
    }

    cancel(): Promise<Status> {
        return this.driver.cancelOperation({
            operationHandle: this.operationHandle
        }).then(response => {
            return this.statusFactory.create(response.status);
        });
    }

    close(): Promise<Status> {
        return this.driver.closeOperation({
            operationHandle: this.operationHandle
        }).then(response => {
            return this.statusFactory.create(response.status);
        });
    }

    waitUntilReady(progress: boolean, callback: Function): void {
        this.status(progress).then(response => {
            switch(response.operationState) {
                case this.TCLIService_type.TOperationState.INITIALIZED_STATE:
                    callback(null, response);
                    return this.waitUntilReady(progress, callback);
                case this.TCLIService_type.TOperationState.RUNNING_STATE:
                    callback(null, response);
                    return this.waitUntilReady(progress, callback);
                case this.TCLIService_type.TOperationState.FINISHED_STATE:
                    return callback(null, response);
                case this.TCLIService_type.TOperationState.CANCELED_STATE:
                    return callback(new Error('The operation was canceled by a client'), response);
                case this.TCLIService_type.TOperationState.CLOSED_STATE:
                    return callback(new Error('The operation was closed by a client'), response);
                case this.TCLIService_type.TOperationState.ERROR_STATE:
                    return callback(new Error('The operation failed due to an error'), response);
                case this.TCLIService_type.TOperationState.PENDING_STATE:
                    return callback(new Error('The operation is in an pending state'), response);
                case this.TCLIService_type.TOperationState.TIMEDOUT_STATE:
                    return callback(new Error('The operation is in an timedout state'), response);
                case this.TCLIService_type.TOperationState.UKNOWN_STATE:
                default:
                    return callback(new Error('The operation is in an unrecognized state'), response);
            }
        }, (error) => {
            callback(error);
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

    result(): OperationResult | null {
        if (this.schema === null) {
            return null;
        }
        
        return new OperationResult(
            this.schema,
            this.data,
            this.TCLIService_type
        );
    }

    private initializeSchema(): Promise<TableSchema> {
        return this.driver.getResultSetMetadata({
            operationHandle: this.operationHandle
        }).then((schema:GetResultSetMetadataResponse) => {
            const status = this.statusFactory.create(schema.status);

            if (status.error()) {
                return Promise.reject(status.getError());
            }

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

    private processFetchResponse(response: FetchResultsResponse): Status {
        const status = this.statusFactory.create(response.status);

        if (status.error()) {
            throw status.getError();
        }

        this._hasMoreRows = !!response.hasMoreRows;

        if (response.results) {
            this.data.push(response.results);
        }

        return status;
    }
}
