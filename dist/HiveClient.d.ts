import IConnectionProvider from './connection/IConnectionProvider';
import IConnectionOptions from './connection/IConnectionOptions';
import { ThriftClient, TCLIServiceTypes } from './hive/Types/';
import IHiveClient from './contracts/IHiveClient';
import { OpenSessionRequest } from './hive/Commands/OpenSessionCommand';
import IHiveSession from './contracts/IHiveSession';
export default class HiveClient implements IHiveClient {
    private TCLIService;
    private TCLIService_types;
    private client;
    /**
     *
     * @param TCLIService generated from TCLIService.thrift (https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift)
     * @param TCLIService_types object generated from TCLIService.thrift
     */
    constructor(TCLIService: object, TCLIService_types: TCLIServiceTypes);
    connect(options: IConnectionOptions, connectionProvider?: IConnectionProvider): Promise<HiveClient>;
    openSession(request: OpenSessionRequest): Promise<IHiveSession>;
    getClient(): ThriftClient;
}
