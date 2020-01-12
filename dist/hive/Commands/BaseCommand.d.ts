import { ThriftClient, TCLIServiceTypes } from "../Types";
export default abstract class BaseCommand {
    protected client: ThriftClient;
    protected TCLIService_types: TCLIServiceTypes;
    constructor(client: ThriftClient, TCLIService_types: TCLIServiceTypes);
    executeCommand<Response>(request: object, command: Function | void): Promise<Response>;
}
