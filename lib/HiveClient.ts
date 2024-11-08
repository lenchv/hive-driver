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
import { EventEmitter } from 'events';
import StatusFactory from './factory/StatusFactory';
import HiveDriverError from './errors/HiveDriverError';

export default class HiveClient extends EventEmitter implements IHiveClient {
    private TCLIService: object;
    private TCLIService_types: TCLIServiceTypes;
    private client: ThriftClient | null;
    private connection: IThriftConnection | null;
    private statusFactory: StatusFactory;
    private connectionProvider: IConnectionProvider;
    private authProvider: IAuthentication;
    private thrift: any;

    /**
     * 
     * @param TCLIService generated from TCLIService.thrift (https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift)
     * @param TCLIService_types object generated from TCLIService.thrift 
     */
    constructor(TCLIService: object, TCLIService_types: TCLIServiceTypes) {
        super();
        this.thrift = thrift;
        this.TCLIService = TCLIService;
        this.TCLIService_types = TCLIService_types;
        this.connectionProvider = new TcpConnection();
        this.authProvider = new NoSaslAuthentication();
        this.statusFactory = new StatusFactory(TCLIService_types);
        this.client = null;
        this.connection = null;
    }

    async connect(
        options: IConnectionOptions,
        connectionProvider?: IConnectionProvider,
        authProvider?: IAuthentication
    ): Promise<HiveClient> {
        if (connectionProvider) {
            this.connectionProvider = connectionProvider;
        }

        if (authProvider) {
            this.authProvider = authProvider;
        }

        this.connection = await this.connectionProvider.connect(options, this.authProvider);

        this.client = this.thrift.createClient(
            this.TCLIService,
            this.connection.getConnection()
        );

        this.connection.getConnection().on('error', (error: Error) => {
            this.emit('error', error);
        });

        this.connection.getConnection().on('reconnecting', (params: {
            delay: number,
            attempt: number
        }) => {
            this.emit('reconnecting', params);
        });

        this.connection.getConnection().on('close', () => {
            this.emit('close');
        });

        this.connection.getConnection().on('timeout', () => {
            this.emit('timeout');
        });

        return this;
    }

    /**
     * Starts new session
     * 
     * @param request
     * @throws {StatusError} 
     */
    openSession(request: OpenSessionRequest): Promise<IHiveSession> {
        if (!this.connection?.isConnected()) {
            return Promise.reject(new HiveDriverError('HiveClient: connection is lost'));
        }

        const driver = new HiveDriver(
            this.TCLIService_types,
            this.getClient()
        );

        return driver.openSession(request).then((response: OpenSessionResponse) => {
            this.statusFactory.create(response.status);

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
            throw new HiveDriverError('HiveClient: client is not initialized');
        }

        return this.client;
    }

    close(): void {
        if (!this.connection) {
            return;
        }

        const thriftConnection = this.connection.getConnection()

        if (typeof thriftConnection.end === 'function') {
            this.connection.getConnection().end();
        }
    }
}