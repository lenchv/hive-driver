const thrift = require('thrift');

import IConnectionProvider from './connection/IConnectionProvider';
import IConnectionOptions from './connection/IConnectionOptions';
import { ThriftClient, TCLIServiceTypes } from './hive/Types/';
import IConnection from './connection/IConnection';
import IHiveClient from './contracts/IHiveClient';
import HiveDriver from './hive/HiveDriver';
import { OpenSessionRequest, OpenSessionResponse } from './hive/Commands/OpenSessionCommand';
import HiveSession from './HiveSession';
import IHiveSession from './contracts/IHiveSession';
import NoSaslTcpConnection from './connection/mechanisms/NoSaslTcpConnection';

export default class HiveClient implements IHiveClient {
    private TCLIService: object;
    private TCLIService_types: TCLIServiceTypes;
    private client: ThriftClient | null;

    /**
     * 
     * @param TCLIService generated from TCLIService.thrift (https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift)
     * @param TCLIService_types object generated from TCLIService.thrift 
     */
    constructor(TCLIService: object, TCLIService_types: TCLIServiceTypes) {
        this.TCLIService = TCLIService;
        this.TCLIService_types = TCLIService_types;
        this.client = null;
    }

    connect(options: IConnectionOptions, connectionProvider?: IConnectionProvider): Promise<HiveClient> {
        if (!connectionProvider) {
            connectionProvider = new NoSaslTcpConnection();
        }
        
        return connectionProvider
            .connect(options)
            .then((connection: IConnection) => {
                this.client = thrift.createClient(
                    this.TCLIService,
                    connection.getConnection()
                );

                return this;
            });
    }

    openSession(request: OpenSessionRequest): Promise<IHiveSession> {
        const driver = new HiveDriver(
            this.TCLIService_types,
            this.getClient()
        );

        return driver.openSession(request).then((response: OpenSessionResponse) => {
            if (response.status.statusCode === this.TCLIService_types.TStatusCode.ERROR_STATUS) {
                throw new Error(response.status.errorMessage);
            }

            const session = new HiveSession(driver, response.sessionHandle);

            return session;
        });
    }

    getClient(): ThriftClient {
        if (!this.client) {
            throw new Error('HiveClient: client is not initialized');
        }

        return this.client;
    }
}