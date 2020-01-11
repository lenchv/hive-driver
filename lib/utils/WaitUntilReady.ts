import IOperation from "../contracts/IOperation";
import { TCLIServiceTypes } from "../hive/Types";
import { GetOperationStatusResponse } from "../hive/Commands/GetOperationStatusCommand";

export default class WaitUntilReady {
    private operation: IOperation;
    private TCLIService_types: TCLIServiceTypes;
    
    constructor(operation: IOperation, TCLIService_types: TCLIServiceTypes) {
        this.operation = operation;
        this.TCLIService_types = TCLIService_types;
    }

    /**
     * Executes until operation has status finished or has one of the invalid states
     * 
     * @param progress flag for operation status command. If it sets true, response will include progressUpdateResponse with progress information
     * @param callback if callback specified it will be called each time the operation status response received and it will be passed as first parameter
     */
    async execute(progress?: boolean, callback?: Function): Promise<IOperation> {
        const response: GetOperationStatusResponse = await this.operation.status(Boolean(progress))
        
        if (typeof callback === 'function') {
            await this.executeCallback(callback.bind(null, response));    
        }

        const isReady = await this.isReady(response.operationState);
        
        if (isReady) {
            return this.operation;
        } else {
            return this.execute(progress, callback);
        }
    }

    private isReady(operationState?: number): Promise<boolean> {
        switch(operationState) {
            case this.TCLIService_types.TOperationState.INITIALIZED_STATE:
                return Promise.resolve(false);
            case this.TCLIService_types.TOperationState.RUNNING_STATE:
                return Promise.resolve(false);
            case this.TCLIService_types.TOperationState.FINISHED_STATE:
                return Promise.resolve(true);
            case this.TCLIService_types.TOperationState.CANCELED_STATE:
                return Promise.reject(new Error('The operation was canceled by a client'));
            case this.TCLIService_types.TOperationState.CLOSED_STATE:
                return Promise.reject(new Error('The operation was closed by a client'));
            case this.TCLIService_types.TOperationState.ERROR_STATE:
                return Promise.reject(new Error('The operation failed due to an error'));
            case this.TCLIService_types.TOperationState.PENDING_STATE:
                return Promise.reject(new Error('The operation is in a pending state'));
            case this.TCLIService_types.TOperationState.TIMEDOUT_STATE:
                return Promise.reject(new Error('The operation is in a timedout state'));
            case this.TCLIService_types.TOperationState.UKNOWN_STATE:
            default:
                return Promise.reject(new Error('The operation is in an unrecognized state'));
        }  
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