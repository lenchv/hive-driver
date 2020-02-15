import IHiveSession from "./IHiveSession";
import { OpenSessionRequest } from "../hive/Commands/OpenSessionCommand";
import IConnectionOptions from "../connection/contracts/IConnectionOptions";
import IConnectionProvider from "../connection/contracts/IConnectionProvider";
import IAuthentication from "../connection/contracts/IAuthentication";
export default interface IHiveClient {
    connect(options: IConnectionOptions, connectionProvider: IConnectionProvider, authProvider: IAuthentication): Promise<IHiveClient>;
    openSession(request: OpenSessionRequest): Promise<IHiveSession>;
    close(): void;
}
