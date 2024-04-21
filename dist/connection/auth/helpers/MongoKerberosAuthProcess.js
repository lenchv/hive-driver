"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IKerberosAuthProcess_1 = require("../../contracts/IKerberosAuthProcess");
const KerberosStep_1 = require("./KerberosStep");
const KerberosError_1 = __importDefault(require("../../../errors/KerberosError"));
/**
 * This class implements Kerberos process with mongodb/kerberos npm library
 *
 * @usage new MongoKerberosAuthProcess(require('kerberos'))
 */
class MongoKerberosAuthProcess {
    qop;
    kerberos;
    kerberosStep;
    options;
    platform;
    constructor(options, kerberos) {
        this.kerberos = kerberos;
        this.options = options;
        this.kerberosStep = null;
        this.qop = IKerberosAuthProcess_1.QOP.AUTH;
        this.platform = process.platform;
    }
    init(options, cb) {
        this.kerberos.initializeClient(this.getSpn(), {
            mechOID: options.http ? this.kerberos.GSS_MECH_OID_SPNEGO : this.kerberos.GSS_C_NO_OID,
            domain: this.options.fqdn,
            user: options.username,
            password: options.password
        }, (error, client) => {
            if (error) {
                return cb(error);
            }
            this.kerberosStep = new KerberosStep_1.KerberosStep(client, options);
            cb(null, client);
        });
    }
    transition(payload, cb) {
        if (!this.kerberosStep) {
            throw new KerberosError_1.default('Kerberos client is not initialized');
        }
        this.kerberosStep.execute(payload, (error, challenge, qop) => {
            if (error) {
                return cb(error);
            }
            if (qop) {
                this.qop = qop;
            }
            cb(null, challenge);
        });
    }
    getQOP() {
        return this.qop;
    }
    getSpn() {
        return this.platform === 'win32'
            ? `${this.options.service}/${this.options.fqdn}`
            : `${this.options.service}@${this.options.fqdn}`;
    }
}
exports.default = MongoKerberosAuthProcess;
//# sourceMappingURL=MongoKerberosAuthProcess.js.map