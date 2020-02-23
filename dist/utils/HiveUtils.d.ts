import { TCLIServiceTypes, ProgressUpdateResponse } from "../hive/Types";
import IOperation from "../contracts/IOperation";
import IOperationResult from "../result/IOperationResult";
export default class HiveUtils {
    private TCLIService_types;
    constructor(TCLIService_types: TCLIServiceTypes);
    waitUntilReady(operation: IOperation, progress?: boolean, callback?: Function): Promise<IOperation>;
    getResult(operation: IOperation, resultHandler?: IOperationResult): IOperationResult;
    fetchAll(operation: IOperation): Promise<IOperation>;
    formatProgress(progressUpdate: ProgressUpdateResponse): string;
}
