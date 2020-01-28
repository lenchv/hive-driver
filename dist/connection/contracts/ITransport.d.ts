/// <reference types="node" />
export declare type ThriftConnection = any;
export default interface ITransport {
    getTransport(): any;
    setOptions(option: string, value: any): void;
    getOptions(): object;
    connect(): any;
    addListener(eventName: string, listener: Function): void;
    removeListener(eventName: string, listener: Function): void;
    emit(eventName: string): void;
    write(data: Buffer | String): void;
    end(): void;
}
