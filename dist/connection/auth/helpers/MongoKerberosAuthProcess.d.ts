import { IKerberosAuthProcess, QOP } from "../../contracts/IKerberosAuthProcess";
import { KerberosInitializeOptions } from "../../types/KerberosInitializeOptions";
import { KerberosStep } from "./KerberosStep";
interface IMongoDbKerberos {
    GSS_MECH_OID_SPNEGO: number;
    GSS_MECH_OID_KRB5: number;
    GSS_C_NO_OID: number;
    initializeClient(service: string, options: object, cb: Function): void;
}
declare type KerberosOptions = {
    fqdn: string;
    service: string;
};
/**
 * This class implements Kerberos process with mongodb/kerberos npm library
 *
 * @usage new MongoKerberosAuthProcess(require('kerberos'))
 */
export default class MongoKerberosAuthProcess implements IKerberosAuthProcess {
    private qop;
    kerberos: IMongoDbKerberos;
    kerberosStep: KerberosStep | null;
    options: KerberosOptions;
    platform: string;
    constructor(options: KerberosOptions, kerberos: IMongoDbKerberos);
    init(options: KerberosInitializeOptions, cb: Function): void;
    transition(payload: string, cb: Function): void;
    getQOP(): QOP;
    private getSpn;
}
export {};
