import { ThriftClient, TCLIServiceTypes } from "../Types";

export default abstract class BaseCommand {
    protected client: ThriftClient;
    protected TCLIService_types: TCLIServiceTypes;
    
    constructor(client: ThriftClient, TCLIService_types: TCLIServiceTypes) {
        this.client = client;
        this.TCLIService_types = TCLIService_types;
    }

    executeCommand<Response>(request: object, command: Function | void): Promise<Response> {
        return new Promise((resolve, reject) => {
            if (typeof command !== 'function') {
                return reject(new Error('Hive driver: the operation does not exist, try to choose another Thrift file.'));
            }

            try {
                command.call(this.client, request, (err: Error, response: Response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }   
}
