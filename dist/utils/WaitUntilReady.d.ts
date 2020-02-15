import IOperation from "../contracts/IOperation";
import { TCLIServiceTypes } from "../hive/Types";
export default class WaitUntilReady {
    private operation;
    private TCLIService_types;
    constructor(operation: IOperation, TCLIService_types: TCLIServiceTypes);
    /**
     * Executes until operation has status finished or has one of the invalid states
     *
     * @param progress flag for operation status command. If it sets true, response will include progressUpdateResponse with progress information
     * @param callback if callback specified it will be called each time the operation status response received and it will be passed as first parameter
     */
    execute(progress?: boolean, callback?: Function): Promise<IOperation>;
    private isReady;
    private executeCallback;
}
