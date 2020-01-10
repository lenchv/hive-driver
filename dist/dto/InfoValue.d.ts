import Int64 from "../utils/Int64";
import { GetInfoValue } from "../hive/Types";
export default class InfoValue {
    private value;
    constructor(value: GetInfoValue);
    getValue(): string | number | Int64 | null;
}
