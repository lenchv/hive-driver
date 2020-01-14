const thrift = require('thrift');

import { ThriftClient, TCLIServiceTypes } from './hive/Types/';
import IHiveClient from './contracts/IHiveClient';
import HiveDriver from './hive/HiveDriver';
import { OpenSessionRequest, OpenSessionResponse } from './hive/Commands/OpenSessionCommand';
import HiveSession from './HiveSession';
import IHiveSession from './contracts/IHiveSession';
import IThriftConnection from './connection/contracts/IThriftConnection';
import IConnectionProvider from './connection/contracts/IConnectionProvider';
import IAuthentication from './connection/contracts/IAuthentication';
import NoSaslAuthentication from './connection/auth/NoSaslAuthentication';
import TcpConnection from './connection/connections/TcpConnection';
import IConnectionOptions from './connection/contracts/IConnectionOptions';

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

    async connect(
        options: IConnectionOptions,
        connectionProvider?: IConnectionProvider,
        authProvider?: IAuthentication
    ): Promise<HiveClient> {
        if (!authProvider) {
            authProvider = new NoSaslAuthentication();
        }

        if (!connectionProvider) {
            connectionProvider = new TcpConnection();
        }
        
        const connection: IThriftConnection = await connectionProvider.connect(options, authProvider);

        this.client = thrift.createClient(
            this.TCLIService,
            connection.getConnection()
        );

        return this;
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

            const session = new HiveSession(
                driver,
                response.sessionHandle,
                this.TCLIService_types
            );

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