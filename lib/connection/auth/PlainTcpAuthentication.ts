import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';
import { SaslPackageFactory, StatusCode } from "./helpers/SaslPackageFactory";
import AuthenticationError from "../../errors/AuthenticationError";

export default class PlainTcpAuthentication implements IAuthentication {
    static AUTH_MECH = 'PLAIN';
    private username: string;
    private password: string;

    constructor(authOptions?: AuthOptions) {
        this.username = authOptions?.username || 'anonymous';
        
        if (authOptions?.password === undefined) {
            this.password = 'anonymous';
        } else {
            this.password = authOptions?.password;
        }
    }

    authenticate(transport: ITransport): Promise<ITransport> {
        return new Promise((resolve, reject) => {
            const onConnect = () => {
                transport.write(SaslPackageFactory.create(
                    StatusCode.START,
                    Buffer.from(PlainTcpAuthentication.AUTH_MECH)
                ));
                transport.write(SaslPackageFactory.create(StatusCode.OK, Buffer.concat([
                    Buffer.from(this.username || ""),
                    Buffer.from([0]),
                    Buffer.from(this.username || ""),
                    Buffer.from([0]),
                    Buffer.from(this.password || ""),
                ])));
            };
            const onData = (data: Buffer) => {
                const result = data[0];

                if (result === StatusCode.COMPLETE) {
                    onSuccess();
                } else {
                    const message = data.slice(5).toString();
    
                    onError(new AuthenticationError('Authentication error: ' + message));
                }
            };
            const onSuccess = () => {
                transport.removeListener('connect', onConnect);
                transport.removeListener('data', onData);

                resolve(transport);
            };
            const onError = (error: Error) => {
                transport.end();

                reject(error);
            };

            transport.connect();

            transport.addListener('connect', onConnect);
            transport.addListener('data', onData);    
            transport.addListener('error', onError);
        });
    }
}
