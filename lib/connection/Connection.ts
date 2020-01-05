import IConnection from "./IConnection";

export default class Connection implements IConnection {
    public connection: any;

    constructor(connection: any) {
        this.connection = connection;
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

}
