import IOperation from "./contracts/IOperation";
import HiveDriver from "./hive/HiveDriver";
import { OperationHandle, TCLIServiceTypes, TableSchema, RowSet } from "./hive/Types";
import Status from "./dto/Status";
import { GetOperationStatusResponse } from "./hive/Commands/GetOperationStatusCommand";
import { GetResultSetMetadataResponse } from "./hive/Commands/GetResultSetMetadataCommand";
import { FetchResultsResponse } from "./hive/Commands/FetchResultsCommand";
import StatusFactory from "./factory/StatusFactory";
import IOperationResult from "./result/IOperationResult";
import NullResult from "./result/NullResult";
import JsonResult from "./result/JsonResult";
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
        } else {
            return this.nextFetch().then(
                response => this.processFetchResponse(response)
            );
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

    waitUntilReady(progress: boolean, callback: Function): Promise<HiveOperation> {
        return this.status(progress).then(response => {
            let error: Error | null = null;
            let next = false;
            
            switch(response.operationState) {
                case this.TCLIService_type.TOperationState.INITIALIZED_STATE:
                    next = true;
                    break;
                case this.TCLIService_type.TOperationState.RUNNING_STATE:
                    next = true;
                    break;
                case this.TCLIService_type.TOperationState.FINISHED_STATE:
                    break;
                case this.TCLIService_type.TOperationState.CANCELED_STATE:
                    error = new Error('The operation was canceled by a client');
                    break;    
                case this.TCLIService_type.TOperationState.CLOSED_STATE:
                    error = new Error('The operation was closed by a client');
                    break;    
                case this.TCLIService_type.TOperationState.ERROR_STATE:
                    error = new Error('The operation failed due to an error');
                    break;    
                case this.TCLIService_type.TOperationState.PENDING_STATE:
                    error = new Error('The operation is in a pending state');
                    break;    
                case this.TCLIService_type.TOperationState.TIMEDOUT_STATE:
                    error = new Error('The operation is in a timedout state');
                    break;    
                case this.TCLIService_type.TOperationState.UKNOWN_STATE:
                default:
                    error = new Error('The operation is in an unrecognized state');
                    break;    
            }

            return this.executeCallback(callback.bind(null, error, response)).then(() => {
                if (error) {
                    return Promise.reject(error);
                } else if (next) {
                    return this.waitUntilReady(progress, callback);
                }
            });
        }).then(() => {
            return this;
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

    result(resultHandler?: IOperationResult): IOperationResult {
        if (this.schema === null) {
            return new NullResult();
        }

        if (!resultHandler) {
            resultHandler = new JsonResult(
                this.TCLIService_type
            );
        }
        
        resultHandler.setSchema(this.schema);
        resultHandler.setData(this.data);

        return resultHandler;
    }

    getQueryId(): Promise<string> {
        return this.driver.getQueryId({
            operationHandle: this.operationHandle
        }).then((response: GetQueryIdResponse) => {
            return response.queryId;
        });
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

    private executeCallback(callback: Function): Promise<any> {
        const result = callback();

        if (result instanceof Promise) {
            return result;
        } else {
            return Promise.resolve(result);
        }
    }
}
