import IConnectionProvider from './connection/IConnectionProvider';
import IConnectionOptions from './connection/IConnectionOptions';
import Connection from './connection/Connection';

export default class HiveClient {
    private connectionProvider: IConnectionProvider;
    private thriftCliService: object;
    private thriftTypes: object;
    private connection: Connection | null;

    /**
     * 
     * @param TCLIService TCLIService generated from TCLIService.thrift
     * @param TCLIService_types TCLIService_types generated from TCLIService.thrift
     * @param connectionProvider 
     */
    constructor(TCLIService: object, TCLIService_types: object, connectionProvider: IConnectionProvider) {
        this.connectionProvider = connectionProvider;
        this.thriftCliService = TCLIService;
        this.thriftTypes = TCLIService_types;
        this.connection = null;
    }

    connect(options: IConnectionOptions): Promise<HiveClient> {
        return this.connectionProvider
            .connect(options)
            .then((connection: Connection) => {
                this.connection = connection;

                return this;
            });
    }
}