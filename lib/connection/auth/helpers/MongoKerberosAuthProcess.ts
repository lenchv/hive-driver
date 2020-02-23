import { IKerberosClient } from "../../contracts/IKerberosClient";
import { IKerberosAuthProcess, QOP } from "../../contracts/IKerberosAuthProcess";
import { KerberosInitializeOptions } from "../../types/KerberosInitializeOptions";
import { KerberosStep } from "./KerberosStep";
import KerberosError from "../../../errors/KerberosError";

interface IMongoDbKerberos {
    GSS_MECH_OID_SPNEGO: number;
    GSS_MECH_OID_KRB5: number;
    GSS_C_NO_OID: number;
    initializeClient(service: string, options: object, cb: Function): void;
}

type KerberosOptions = {
    fqdn: string,
    service: string
};

/**
 * This class implements Kerberos process with mongodb/kerberos npm library
 * 
 * @usage new MongoKerberosAuthProcess(require('kerberos'))
 */
export default class MongoKerberosAuthProcess implements IKerberosAuthProcess {
    private qop: QOP;
    kerberos: IMongoDbKerberos;
    kerberosStep: KerberosStep | null;
    options: KerberosOptions;
    platform: string;

    constructor(options: KerberosOptions, kerberos: IMongoDbKerberos) {
        this.kerberos = kerberos;
        this.options = options;
        this.kerberosStep = null;
        this.qop = QOP.AUTH;
        this.platform = process.platform;
    }

    init(options: KerberosInitializeOptions, cb: Function): void {
        this.kerberos.initializeClient(
            this.getSpn(),
            {
                mechOID: options.http ? this.kerberos.GSS_MECH_OID_SPNEGO : this.kerberos.GSS_C_NO_OID,
                domain: this.options.fqdn,
                user: options.username,
                password: options.password
            },
            (error: Error, client: IKerberosClient) => {
                if (error) {
                    return cb(error);
                }

                this.kerberosStep = new KerberosStep(client, options);

                cb(null, client);
            }
        );
    }

    transition(payload: string, cb: Function): void {
        if (!this.kerberosStep) {
            throw new KerberosError('Kerberos client is not initialized');
        }

        this.kerberosStep.execute(payload, (error: Error, challenge: string, qop?: QOP) => {
            if (error) {
                return cb(error);
            }

            if (qop) {
                this.qop = qop;
            }

            cb(null, challenge);
        });
    }

    getQOP(): QOP {
        return this.qop;   
    }

    private getSpn(): string {
        return this.platform === 'win32'
            ? `${this.options.service}/${this.options.fqdn}`
            : `${this.options.service}@${this.options.fqdn}`;
    }
}