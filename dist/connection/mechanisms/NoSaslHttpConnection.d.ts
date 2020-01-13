import IConnectionProvider from "../IConnectionProvider";
import IConnectionOptions from "../IConnectionOptions";
import Connection from "../Connection";
export default class NoSaslHttpConnection implements IConnectionProvider {
    connect(options: IConnectionOptions): Promise<Connection>;
    private getAuthorization;
    private getNodeOptions;
}
