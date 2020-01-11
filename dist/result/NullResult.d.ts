import IOperationResult from "./IOperationResult";
import IOperation from "../contracts/IOperation";
export default class NullResult implements IOperationResult {
    setOperation(operation: IOperation): void;
    getValue(): null;
}
