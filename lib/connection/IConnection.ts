export type ThriftConnection = any;

export default interface IConnection {
    getThriftConnection(): ThriftConnection;

    connect(): any;

    addListener(eventName: string, listener: Function): void;

    removeListener(eventName: string, listener: Function): void;

    write(data: Buffer | String): void;

    end(): void;
}