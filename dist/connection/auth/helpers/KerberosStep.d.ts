import { IKerberosClient } from "../../contracts/IKerberosClient";
import { KerberosInitializeOptions } from "../../types/KerberosInitializeOptions";
export declare class KerberosStep {
    private step;
    private client;
    private options;
    private attempts;
    constructor(client: IKerberosClient, options: KerberosInitializeOptions);
    execute(payload: string, cb: Function): void;
    first(payload: string, cb: Function): void;
    second(payload: string, cb: Function): void;
    third(payload: string, cb: Function): void;
    fourth(payload: string, cb: Function): void;
}
