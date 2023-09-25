/// <reference types="node" />
export type Options = {
    username?: string;
    password?: string;
    ssl?: boolean;
    https?: boolean;
    debug?: boolean;
    max_attempts?: number;
    retry_max_delay?: number;
    connect_timeout?: number;
    timeout?: number;
    headers?: object;
    path?: string;
    ca?: Buffer | string;
    cert?: Buffer | string;
    key?: Buffer | string;
    [key: string]: any;
};
export default interface IConnectionOptions {
    host: string;
    port: number;
    options?: Options;
}
