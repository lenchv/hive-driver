import HiveDriver from "./hive/HiveDriver";
import { GetInfoResponse } from "./hive/Commands/GetInfoCommand";
import IHiveSession from './contracts/IHiveSession';
import { SessionHandle } from "./hive/Types";
import IOperation from "./contracts/IOperation";
export default class HiveSession implements IHiveSession {
    private driver;
    private sessionHandle;
    constructor(driver: HiveDriver, sessionHandle: SessionHandle);
    getInfo(infoType: number): Promise<GetInfoResponse>;
    executeStatement(statement: string): Promise<IOperation>;
}
