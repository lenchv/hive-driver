import IConnectionProvider from "../connection/IConnectionProvider";
import IHiveSession from "./IHiveSession";
import IConnectionOptions from "../connection/IConnectionOptions";
import { OpenSessionRequest } from "../hive/Commands/OpenSessionCommand";

export default interface IHiveClient {
    connect(connectionProvider: IConnectionProvider, options: IConnectionOptions): Promise<IHiveClient>;

    openSession(request: OpenSessionRequest): Promise<IHiveSession>;
}
