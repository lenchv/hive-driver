import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';
import { SaslPackageFactory, StatusCode } from "./helpers/SaslPackageFactory";
import { IKerberosAuthProcess } from "../contracts/IKerberosAuthProcess";
import { IKerberosClient } from "../contracts/IKerberosClient";
import AuthenticationError from "../../errors/AuthenticationError";

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
            this.authProcess.init(
                {
                    password: this.password,
                    username: this.username,
                },
                (error: Error, client: IKerberosClient) => {
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
                        const status = data[0];

                        if (status === StatusCode.OK) {
                            this.nextTransition(transport, data).catch(onError);
                        } else if (status === StatusCode.COMPLETE) {
                            onSuccess();
                        } else {
                            const message = data.slice(5).toString();
            
                            onError(new AuthenticationError('Authentication error: ' + message));
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

    private nextTransition(transport: ITransport, data: Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            const payload = data.slice(5).toString('base64');

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
}
