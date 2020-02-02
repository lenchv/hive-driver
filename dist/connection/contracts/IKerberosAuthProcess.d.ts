import { KerberosInitializeOptions } from "../types/KerberosInitializeOptions";
export declare enum QOP {
    AUTH = 1,
    AUTH_INTEGRITY = 2,
    AUTH_CONFIDENTIALITY = 4
}
export interface IKerberosAuthProcess {
    /**
     * This method should initiate the kerberos process and return IKerberosClient
     * @param options
     * @param cb
     */
    init(options: KerberosInitializeOptions, cb: Function): void;
    /**
     * This method should process three SASL steps
     * @param payload
     * @param cb
     */
    transition(payload: string, cb: Function): void;
    /**
     * Quality of protection
     */
    getQOP(): QOP;
}
