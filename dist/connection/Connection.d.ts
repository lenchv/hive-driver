/// <reference types="node" />
import IConnection, { ThriftConnection } from "./IConnection";
export default class Connection implements IConnection {
    connection: ThriftConnection;
    constructor(connection: ThriftConnection);
    getConnection(): ThriftConnection;
    connect(): any;
    addListener(eventName: string, listener: Function): void;
    removeListener(eventName: string, listener: Function): void;
    write(data: Buffer | String): void;
    end(): void;
}
