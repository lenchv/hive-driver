import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';
import { SaslPackageFactory, StatusCode } from "./helpers/SaslPackageFactory";

enum QOP {
    AUTH = 1,
    AUTH_INTEGRITY = 2,
    AUTH_CONFIDENTIALITY = 4,
}

type KerberosClient = any;

interface IKerberosAuthProcess {
    init(username: string, password: string, cb: Function): void;

    transition(payload: Buffer | string, cb: Function): void;
}

class KerberosAuthProcess implements IKerberosAuthProcess {
    private client: KerberosClient;

    constructor(host: string, service: string) {

    }
    
    init(username: string, password: string, cb: Function): void {
        cb(null, this.client);
    }

    transition(payload: Buffer | string, cb: Function): void {
        cb(null, payload);
    }
}

export default class KerberosTcpAuthentication implements IAuthentication {
    static AUTH_MECH = 'GSSAPI';
    private username: string;
    private password: string;
    private authProcess: IKerberosAuthProcess;

    constructor(options: AuthOptions, authProcess: IKerberosAuthProcess) {
        this.username = options?.username || 'anonymous';
        this.password = options?.password !== undefined ? options?.password : 'anonymous';
        this.authProcess = authProcess;
    }

    authenticate(transport: ITransport): Promise<ITransport> {
        return new Promise((resolve, reject) => {
            let transition = 0;
            let qualityOfProtection = QOP.AUTH;
            this.authProcess.init(
                this.username,
                this.password,
                (error: Error, client: KerberosClient) => {
                    if (error) {
                        return reject(error);
                    }

                    const onError = (err: Error) => {
                        transport.end();
                        reject(err);
                    };

                    const onSuccess = () => {
                        transport.removeListener('connect', onConnect);
                        transport.removeListener('data', onData);
            
                        resolve(transport);
                    };

                    const onConnect = () => {
                        this.onConnect(transport).catch(onError);
                    };

                    const onData = (data: Buffer) => {
                        transition++;
                        const status = data[0];

                        if (status === StatusCode.OK) {
                            const payload = data.slice(5).toString('base64');
                            if (transition < 2) {
                                this.nextTransition(transport, payload).catch(onError);
                            } else {
                                this.thirdTransition(transport, client, payload).then((qop: QOP) => {
                                    qualityOfProtection = qop;
                                }).catch(onError);
                            }
                        } else if (status === StatusCode.COMPLETE) {
                            onSuccess();
                        } else {
                            const message = data.slice(5).toString();
            
                            onError(new Error('Authenticated error: ' + message));
                        }
                    };

                    transport.connect();

                    transport.addListener('connect', onConnect);
                    transport.addListener('data', onData);
                    transport.addListener('error', onError);
                }
            );
        });
    }

    private onConnect(transport: ITransport): Promise<void> {
        return new Promise((resolve, reject) => {
            transport.write(SaslPackageFactory.create(
                StatusCode.START,
                Buffer.from(KerberosTcpAuthentication.AUTH_MECH)
            ));
    
            this.authProcess.transition('', (err: Error, token: string) => {
                if (err) {
                    return reject(err);
                }
    
                transport.write(SaslPackageFactory.create(
                    StatusCode.OK,
                    Buffer.from(token || '', 'base64')
                ));

                resolve();
            });
        });
    }

    private nextTransition(transport: ITransport, payload: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.authProcess.transition(payload, (err: Error, response: string) => {
                if (err) {
                    return reject(err);
                }
    
                transport.write(SaslPackageFactory.create(
                    StatusCode.OK,
                    Buffer.from(response || '', 'base64')
                ));

                resolve();
            });
        });
    }

    private thirdTransition(transport: ITransport, client: KerberosClient, payload: string): Promise<QOP> {
        return new Promise((resolve, reject) => {
            client.unwrap(payload, (err: Error, response: string) => {
                if (err) {
                    return reject(err);
                }

                const qop: QOP = Buffer.from(response, 'base64')[0];

                client.wrap(response, { user: this.username }, (err: Error, wrapped: string) => {
                    if (err) {
                        return reject(err);
                    }
    
                    transport.write(SaslPackageFactory.create(
                        StatusCode.OK,
                        Buffer.from(wrapped || '', 'base64')
                    ));

                    resolve(qop);
                });
            });
        });
    }
}
