import { TCLIServiceTypes, ProgressUpdateResponse, FetchOrientation } from "../hive/Types";
import IOperation from "../contracts/IOperation";
import WaitUntilReady from "./WaitUntilReady";
import IOperationResult from "../result/IOperationResult";
import GetResult from "./GetResult";
import ProgressUpdateTransformer from "./ProgressUpdateTransformer";

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

    fetchAll(operation: IOperation, orientation?: FetchOrientation): Promise<IOperation> {
        return operation.fetch(orientation)
            .then(() => {
                if (operation.hasMoreRows()) {
                    return this.fetchAll(operation);
                } else {
                    return operation;
                }
            });
    }

    formatProgress(progressUpdate: ProgressUpdateResponse): string {
        return String(new ProgressUpdateTransformer(progressUpdate));
    }
}
