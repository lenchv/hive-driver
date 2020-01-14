/// <reference types="node" />
import IConnection, { ThriftConnection } from "./IConnection";
import { TlsOptions } from "tls";
export default class TlsConnection implements IConnection {
    private host;
    private port;
    private connection;
    private options;
    constructor(host: string, port: number, options?: TlsOptions);
    getConnection(): ThriftConnection;
    connect(): any;
    addListener(eventName: string, listener: Function): void;
    removeListener(eventName: string, listener: Function): void;
    write(data: Buffer | String): void;
    end(): void;
    emit(eventName: string): void;
}
