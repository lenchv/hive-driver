export default interface IConnection {
    connect(): any;

    addListener(eventName: string, listener: Function): void;

    removeListener(eventName: string, listener: Function): void;

    write(data: Buffer | String): void;

    end(): void;
}