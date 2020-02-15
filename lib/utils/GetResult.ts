import { TCLIServiceTypes } from "../hive/Types";
import IOperationResult from "../result/IOperationResult";
import NullResult from "../result/NullResult";
import JsonResult from "../result/JsonResult";
import IOperation from '../contracts/IOperation';

export default class GetResult {
    private TCLIService_types: TCLIServiceTypes;
    private operation: IOperation;

    constructor(operation: IOperation, TCLIService_types: TCLIServiceTypes) {
        this.TCLIService_types = TCLIService_types;
        this.operation = operation;
    }

    /**
     * Combines operation schema and data
     * 
     * @param resultHandler you may specify your own result combiner to implement IOperationResult and pass as paramenter.
     *                      If resultHandler is not specified, the internal handler will interpret result as Json.
     */
    execute(resultHandler?: IOperationResult): IOperationResult {
        if (!resultHandler) {
            resultHandler = this.getDefaultHandler();
        }

        resultHandler.setOperation(this.operation);

        return resultHandler;
    }

    private getDefaultHandler(): IOperationResult {
        const schema = this.operation.getSchema();

        if (schema === null) {
            return new NullResult();
        } else {
            return new JsonResult(
                this.TCLIService_types
            );
        }
    }
}
