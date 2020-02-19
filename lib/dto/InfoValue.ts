import { GetInfoValue } from "../hive/Types";

type InfoResultType = string | number | Buffer | null;

export default class InfoValue {
    private value: GetInfoValue;

    constructor(value: GetInfoValue) {
        this.value = value;
    }

    getValue(): InfoResultType {
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
            return infoValue.lenValue;
        } else {
            return null;
        }
    }
}
