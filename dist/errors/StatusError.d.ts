import { Status } from "../hive/Types";
export default class StatusError implements Error {
    name: string;
    message: string;
    code: number;
    stack?: string;
    constructor(status: Status);
}
