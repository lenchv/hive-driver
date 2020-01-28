/// <reference types="node" />
import ITransport from "../contracts/ITransport";
export default class TcpTransport implements ITransport {
    private host;
    private port;
    private options;
    private connection;
    constructor(host: string, port: number);
    getTransport(): any;
    setOptions(option: string, value: any): void;
    getOptions(): object;
    connect(): any;
    addListener(eventName: string, listener: Function): void;
    removeListener(eventName: string, listener: Function): void;
    write(data: Buffer | String): void;
    end(): void;
    emit(eventName: string): void;
}
