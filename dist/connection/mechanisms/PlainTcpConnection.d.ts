import IConnectionProvider from "../IConnectionProvider";
import IConnectionOptions from "../IConnectionOptions";
import IConnection from "../IConnection";
export default class PlainTcpConnection implements IConnectionProvider {
    static AUTH_MECH: string;
    connect(options: IConnectionOptions): Promise<IConnection>;
    private authenticate;
    private createThriftConnection;
}
