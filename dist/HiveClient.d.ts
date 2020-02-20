/// <reference types="node" />
import { ThriftClient, TCLIServiceTypes } from './hive/Types/';
import IHiveClient from './contracts/IHiveClient';
import { OpenSessionRequest } from './hive/Commands/OpenSessionCommand';
import IHiveSession from './contracts/IHiveSession';
import IConnectionProvider from './connection/contracts/IConnectionProvider';
import IAuthentication from './connection/contracts/IAuthentication';
import IConnectionOptions from './connection/contracts/IConnectionOptions';
import { EventEmitter } from 'events';
export default class HiveClient extends EventEmitter implements IHiveClient {
    private TCLIService;
    private TCLIService_types;
    private client;
    private connection;
    private statusFactory;
    private connectionProvider;
    private authProvider;
    private thrift;
    /**
     *
     * @param TCLIService generated from TCLIService.thrift (https://github.com/apache/hive/blob/master/service-rpc/if/TCLIService.thrift)
     * @param TCLIService_types object generated from TCLIService.thrift
     */
    constructor(TCLIService: object, TCLIService_types: TCLIServiceTypes);
    connect(options: IConnectionOptions, connectionProvider?: IConnectionProvider, authProvider?: IAuthentication): Promise<HiveClient>;
    /**
     * Starts new session
     *
     * @param request
     * @throws {StatusError}
     */
    openSession(request: OpenSessionRequest): Promise<IHiveSession>;
    getClient(): ThriftClient;
    close(): void;
}
