/// <reference types="node" />
import { TlsOptions } from "tls";
import ITransport from "../contracts/ITransport";
export default class TlsTransport implements ITransport {
    private host;
    private port;
    private connection;
    private options;
    constructor(host: string, port: number, options?: TlsOptions);
    setOptions(option: string, value: any): void;
    getTransport(): any;
    connect(): any;
    addListener(eventName: string, listener: Function): void;
    removeListener(eventName: string, listener: Function): void;
    write(data: Buffer | String): void;
    end(): void;
    emit(eventName: string): void;
}
