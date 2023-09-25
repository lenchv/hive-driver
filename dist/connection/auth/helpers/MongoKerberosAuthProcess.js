"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var IKerberosAuthProcess_1 = require("../../contracts/IKerberosAuthProcess");
var KerberosStep_1 = require("./KerberosStep");
var KerberosError_1 = __importDefault(require("../../../errors/KerberosError"));
/**
 * This class implements Kerberos process with mongodb/kerberos npm library
 *
 * @usage new MongoKerberosAuthProcess(require('kerberos'))
 */
var MongoKerberosAuthProcess = /** @class */ (function () {
    function MongoKerberosAuthProcess(options, kerberos) {
        this.kerberos = kerberos;
        this.options = options;
        this.kerberosStep = null;
        this.qop = IKerberosAuthProcess_1.QOP.AUTH;
        this.platform = process.platform;
    }
    MongoKerberosAuthProcess.prototype.init = function (options, cb) {
        var _this = this;
        this.kerberos.initializeClient(this.getSpn(), {
            mechOID: options.http ? this.kerberos.GSS_MECH_OID_SPNEGO : this.kerberos.GSS_C_NO_OID,
            domain: this.options.fqdn,
            user: options.username,
            password: options.password
        }, function (error, client) {
            if (error) {
                return cb(error);
            }
            _this.kerberosStep = new KerberosStep_1.KerberosStep(client, options);
            cb(null, client);
        });
    };
    MongoKerberosAuthProcess.prototype.transition = function (payload, cb) {
        var _this = this;
        if (!this.kerberosStep) {
            throw new KerberosError_1.default('Kerberos client is not initialized');
        }
        this.kerberosStep.execute(payload, function (error, challenge, qop) {
            if (error) {
                return cb(error);
            }
            if (qop) {
                _this.qop = qop;
            }
            cb(null, challenge);
        });
    };
    MongoKerberosAuthProcess.prototype.getQOP = function () {
        return this.qop;
    };
    MongoKerberosAuthProcess.prototype.getSpn = function () {
        return this.platform === 'win32'
            ? "".concat(this.options.service, "/").concat(this.options.fqdn)
            : "".concat(this.options.service, "@").concat(this.options.fqdn);
    };
    return MongoKerberosAuthProcess;
}());
exports.default = MongoKerberosAuthProcess;
//# sourceMappingURL=MongoKerberosAuthProcess.js.map