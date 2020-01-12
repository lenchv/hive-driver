import { TCLIServiceTypes } from "../hive/Types";
import IOperationResult from "../result/IOperationResult";
import IOperation from '../contracts/IOperation';
export default class GetResult {
    private TCLIService_types;
    private operation;
    constructor(operation: IOperation, TCLIService_types: TCLIServiceTypes);
    /**
     * Combines operation schema and data
     *
     * @param resultHandler you may specify your own result combiner to implement IOperationResult and pass as paramenter.
     *                      If resultHandler is not specified, the internal handler will interpret result as Json.
     */
    execute(resultHandler?: IOperationResult): IOperationResult;
    private getDefaultHandler;
}
