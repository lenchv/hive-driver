import IConnection, { ThriftConnection } from "./IConnection";

export default class Connection implements IConnection {
    public connection: ThriftConnection;

    constructor(connection: ThriftConnection) {
        this.connection = connection;
    }

    getConnection(): ThriftConnection {
        return this.connection;
    }

    connect(): any {
        return this.connection.connect();
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
        return this.connection.emit(eventName);
    }   
}
