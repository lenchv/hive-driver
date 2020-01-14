/// <reference types="node" />
import IConnection, { ThriftConnection } from "./IConnection";
export default class TcpConnection implements IConnection {
    private host;
    private port;
    private connection;
    constructor(host: string, port: number);
    getConnection(): ThriftConnection;
    connect(): any;
    addListener(eventName: string, listener: Function): void;
    removeListener(eventName: string, listener: Function): void;
    write(data: Buffer | String): void;
    end(): void;
    emit(eventName: string): void;
}
