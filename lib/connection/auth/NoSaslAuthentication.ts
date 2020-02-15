const thrift = require('thrift');
import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";

export default class NoSaslAuthentication implements IAuthentication {
    authenticate(transport: ITransport): Promise<ITransport> {
        transport.connect();
        transport.setOptions('transport', thrift.TBufferedTransport);

        return Promise.resolve(transport);
    }
}
