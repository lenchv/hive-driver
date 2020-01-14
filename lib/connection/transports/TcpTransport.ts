const net = require('net');
import ITransport from "../contracts/ITransport";

export default class TcpTransport implements ITransport {
    private host: string;
    private port: number;
    private connection: any;

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    getTransport(): any {
        return this.connection;
    }

    setOptions() {}

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
