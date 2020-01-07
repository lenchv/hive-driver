import IConnectionProvider from './connection/IConnectionProvider';
import IConnectionOptions from './connection/IConnectionOptions';
import { ThriftClient } from './hive/Types/';
import ThriftService, { TCLIServiceTypes, ThriftSession, ExecuteStatementRequest, ThriftResponse } from './hive/ThriftService';
import IConnection from './connection/IConnection';
import ExecuteStatementResponse, { ExecuteStatementResult } from './ExecuteStatementResponse';

type ClientParameters = {
    /** TCLIService object generated from TCLIService.thrift (https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift) */
    TCLIService: object,
    
    /** TCLIService_types object generated from TCLIService.thrift */
    TCLIService_types: TCLIServiceTypes,
    
    /**
     * One of the values TCLIService_types.TProtocolVersion. May be different depends on version of Hive you use.
     * For instance, for Hive lower that 3.x it is better to use HIVE_CLI_SERVICE_PROTOCOL_V8.
     */
    protocol: number,

    /**
     * Options for connection provider
     */
    connectionOptions: IConnectionOptions
}

export default class HiveClient {
    private connectionOptions: IConnectionOptions;
    private session: ThriftSession | null;
    
    public thriftService: ThriftService;
    public connection: IConnection | null;

    constructor(parameters: ClientParameters) {
        const {
            TCLIService,
            TCLIService_types,
            protocol,
            connectionOptions,
        } = parameters;

        this.thriftService = new ThriftService(TCLIService, TCLIService_types, protocol);
        this.connectionOptions = connectionOptions;
        this.session = null;
        this.connection = null;
    }

    connect(connectionProvider: IConnectionProvider): Promise<ThriftClient> {
        return connectionProvider
            .connect(this.connectionOptions)
            .then((connection: IConnection) => {
                this.connection = connection;

                this.thriftService.createClient(connection.getThriftConnection());

                return this.thriftService.getClient();
            });
    }

    openSession(configuration?: object): Promise<ThriftSession> {
        return this.thriftService.openSession({
            username: this.connectionOptions.options?.username,
            password: this.connectionOptions.options?.password,
            configuration,
        }).then(session => {
            this.session = session;

            return session;
        });
    }

    execute(statement: string, options?: ExecuteStatementRequest): Promise<ExecuteStatementResult> {
        return this.thriftService.executeStatement(
            this.getSession(),
            statement,
            options || {}
        ).then((response: ThriftResponse) => {
            const result = new ExecuteStatementResponse(
                response,
                this.thriftService
            );

            return result.create();
        })
    }

    getSession(): ThriftSession {
        if (this.session === null) {
            throw new Error('session is not initialized. Execute "openSession" to initialize session.');
        }

        return this.session;
    }
}