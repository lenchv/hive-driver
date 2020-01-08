import IOperation from "./contracts/IOperation";
import HiveDriver from "./hive/HiveDriver";
import { OperationHandle } from "./hive/Types";

export default class Operation implements IOperation {
    private driver: HiveDriver;
    private operationHandle: OperationHandle;

    constructor(driver: HiveDriver, operationHandle: OperationHandle) {
        this.driver = driver;
        this.operationHandle = operationHandle;
    }
}
