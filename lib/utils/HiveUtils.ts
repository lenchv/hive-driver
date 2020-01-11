import { TCLIServiceTypes } from "../hive/Types";
import IOperation from "../contracts/IOperation";
import WaitUntilReady from "./WaitUntilReady";
import IOperationResult from "../result/IOperationResult";
import GetResult from "./GetResult";

export default class HiveUtils {
    private TCLIService_types: TCLIServiceTypes;

    constructor(TCLIService_types: TCLIServiceTypes) {
        this.TCLIService_types = TCLIService_types;
    }

    waitUntilReady(operation: IOperation, progress?: boolean, callback?: Function): Promise<IOperation> {
        const waitUntilReady = new WaitUntilReady(
            operation,
            this.TCLIService_types
        );

        return waitUntilReady.execute(progress, callback);
    }

    getResult(operation: IOperation, resultHandler?: IOperationResult): IOperationResult {
        const getResult = new GetResult(
            operation,
            this.TCLIService_types
        );

        return getResult.execute(resultHandler);
    }
}