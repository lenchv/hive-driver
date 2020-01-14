const net = require('net');
import IConnection, { ThriftConnection } from "./IConnection";

export default class TcpConnection implements IConnection {
    private host: string;
    private port: number;
    private connection: any;

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    getConnection(): ThriftConnection {
        return this.connection;
    }

    connect(): any {
        this.connection = net.createConnection(this.port, this.host);
    };

    addListener(eventName: string, listener: Function): void {
        return this.connection.addListener(eventName, listener);
    }

    removeListener(eventName: string, listener: Function): void {
        return this.connection.removeListener(eventName, listener);
    }

    write(data: Buffer | String): void {
        return this.connection.write(data);
    }

    end(): void {
        return this.connection.end();
    }

    emit(eventName: string): void {
        this.connection.emit(eventName);
    }
}
