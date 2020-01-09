import IOperation from "./contracts/IOperation";
import HiveDriver from "./hive/HiveDriver";
import { OperationHandle } from "./hive/Types";
export default class Operation implements IOperation {
    private driver;
    private operationHandle;
    constructor(driver: HiveDriver, operationHandle: OperationHandle);
}
