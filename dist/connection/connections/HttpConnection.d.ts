import IThriftConnection from "../contracts/IThriftConnection";
import IConnectionProvider from "../contracts/IConnectionProvider";
import IConnectionOptions from "../contracts/IConnectionOptions";
import IAuthentication from "../contracts/IAuthentication";
export default class HttpConnection implements IConnectionProvider, IThriftConnection {
    private thrift;
    private connection;
    connect(options: IConnectionOptions, authProvider: IAuthentication): Promise<IThriftConnection>;
    getConnection(): any;
    isConnected(): boolean;
    private getNodeOptions;
    private addCookieHandler;
}
