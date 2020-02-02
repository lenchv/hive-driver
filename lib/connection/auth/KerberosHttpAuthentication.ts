import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';
import { IKerberosAuthProcess } from "../contracts/IKerberosAuthProcess";
import { IKerberosClient } from "../contracts/IKerberosClient";

type HttpAuthOptions = AuthOptions & {
    headers?: object
};

export default class KerberosHttpAuthentication implements IAuthentication {
    private username: string;
    private password: string;
    private headers: object;
    private authProcess: IKerberosAuthProcess;

    constructor(options: HttpAuthOptions, authProcess: IKerberosAuthProcess) {
        this.username = options?.username || 'anonymous';
        this.password = options?.password !== undefined ? options?.password : 'anonymous';
        this.headers = options?.headers || {};
        this.authProcess = authProcess;
    }
    
    authenticate(transport: ITransport): Promise<ITransport> {
        return new Promise((resolve, reject) => {
            this.authProcess.init({
                username: this.username,
                password: this.password,
                http: true
            }, (error: Error, client: IKerberosClient) => {
                if (error) {
                    return reject(error);
                }
    
                client.step('', (error: Error, token: string) => {
                    if (error) {
                        return reject(error);
                    }

                    transport.setOptions('headers', {
                        ...(this.headers),
                        Authorization: 'Negotiate : ' + token
                    });

                    resolve(transport);
                });
            });
        });
    }
}