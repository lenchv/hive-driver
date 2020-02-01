import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';

export enum StatusCode {
    START=1,
    OK=2,
    BAD=3,
    ERROR=4,
    COMPLETE=5,
};

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
                transport.write(this.createPackage(
                    StatusCode.START,
                    Buffer.from(PlainTcpAuthentication.AUTH_MECH)
                ));
                transport.write(this.createPackage(StatusCode.OK, Buffer.concat([
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
    
                    onError(new Error('Authentication error: ' + message));
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

    private createPackage(status: StatusCode, body: Buffer) {
        const bodyLength = new Buffer(4);

        bodyLength.writeUInt32BE(body.length, 0);

        return Buffer.concat([ Buffer.from([ status ]), bodyLength, body ]);
    }
}
