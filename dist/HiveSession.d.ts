import HiveDriver from "./hive/HiveDriver";
import IHiveSession from './contracts/IHiveSession';
import { SessionHandle, TCLIServiceTypes } from "./hive/Types";
import IOperation from "./contracts/IOperation";
import InfoResponse from "./responses/InfoResponse";
import Status from "./dto/Status";
export default class HiveSession implements IHiveSession {
    private driver;
    private sessionHandle;
    private TCLIService_types;
    constructor(driver: HiveDriver, sessionHandle: SessionHandle, TCLIService_types: TCLIServiceTypes);
    /**
     * @param infoType one of the values TCLIService_types.TGetInfoType
     */
    getInfo(infoType: number): Promise<InfoResponse>;
    executeStatement(statement: string): Promise<IOperation>;
    close(): Promise<Status>;
}
