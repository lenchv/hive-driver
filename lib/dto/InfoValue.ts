import Int64 from "../utils/Int64";
import { GetInfoValue } from "../hive/Types";

export default class InfoValue {
    private value: GetInfoValue;

    constructor(value: GetInfoValue) {
        this.value = value;
    }

    getValue(): string | number | Int64 | null {
        const infoValue = this.value;

        if (infoValue.stringValue) {
            return infoValue.stringValue;
        } else if (infoValue.smallIntValue) {
            return infoValue.smallIntValue;
        } else if (infoValue.integerBitmask) {
            return infoValue.integerBitmask;
        } else if (infoValue.integerFlag) {
            return infoValue.integerFlag;
        } else if (infoValue.lenValue) {
            return new Int64(infoValue.lenValue);
        } else {
            return null;
        }
    }
}