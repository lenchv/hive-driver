import IConnectionOptions from "../contracts/IConnectionOptions";
import IAuthentication from "../contracts/IAuthentication";
import IThriftConnection from "../contracts/IThriftConnection";
import IConnectionProvider from "../contracts/IConnectionProvider";
export default class TcpConnection implements IConnectionProvider, IThriftConnection {
    private connection;
    connect(options: IConnectionOptions, authProvider: IAuthentication): Promise<IThriftConnection>;
    getConnection(): any;
    isConnected(): boolean;
    private createConnection;
}
