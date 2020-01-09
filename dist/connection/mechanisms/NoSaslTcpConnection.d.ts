import IConnectionProvider from "../IConnectionProvider";
import IConnectionOptions from "../IConnectionOptions";
import Connection from "../Connection";
export default class NoSaslTcpConnection implements IConnectionProvider {
    connect(options: IConnectionOptions): Promise<Connection>;
}
