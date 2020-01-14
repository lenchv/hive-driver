const tls = require('tls');
const constants = require('constants');
import { TlsOptions } from "tls";
import ITransport from "../contracts/ITransport";

export default class TlsTransport implements ITransport {
    private host: string;
    private port: number;
    private connection: any;
    private options: TlsOptions;

    constructor(host: string, port: number, options: TlsOptions = {}) {
        this.host = host;
        this.port = port;
        this.options = {
            secureProtocol: 'SSLv23_method',
            secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3,
            rejectUnauthorized: false,
            ca: options?.ca,
            cert: options?.cert,
            key: options?.key,
            ...options
        };
    }

    setOptions(option: string, value: any) {
        this.options = {
            ...this.options,
            [option]: value
        };
    }

    getTransport(): any {
        return this.connection;
    }

    connect(): any {
        this.connection = tls.connect(this.port, this.host, this.options);
        this.connection.setMaxSendFragment(65536);
        this.connection.setNoDelay(true);
    };

    addListener(eventName: string, listener: Function): void {
        if (eventName === 'connect') {
            return this.connection.addListener('secureConnect', listener);
        } else {
            return this.connection.addListener(eventName, listener);
        }
    }

    removeListener(eventName: string, listener: Function): void {
        if (eventName === 'connect') {
            return this.connection.removeListener('secureConnect', listener);
        } else {
            return this.connection.removeListener(eventName, listener);
        }
    }

    write(data: Buffer | String): void {
        return this.connection.write(data);
    }

    end(): void {
        return this.connection.end();
    }

    emit(eventName: string) {
        if (eventName === 'connect') {
            this.connection.emit('secureConnect');
        } else {
            this.connection.emit(eventName);
        }
    }
}
