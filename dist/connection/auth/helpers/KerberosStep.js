"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KerberosStep = void 0;
const KerberosError_1 = __importDefault(require("../../../errors/KerberosError"));
var TransitionState;
(function (TransitionState) {
    TransitionState[TransitionState["STEP_1"] = 0] = "STEP_1";
    TransitionState[TransitionState["STEP_2"] = 1] = "STEP_2";
    TransitionState[TransitionState["STEP_3"] = 2] = "STEP_3";
    TransitionState[TransitionState["STEP_4"] = 3] = "STEP_4";
})(TransitionState || (TransitionState = {}));
class KerberosStep {
    step;
    client;
    options;
    attempts;
    constructor(client, options) {
        this.step = TransitionState.STEP_1;
        this.client = client;
        this.attempts = 10;
        this.options = options;
    }
    execute(payload, cb) {
        switch (this.step) {
            case TransitionState.STEP_1:
                return this.first(payload, cb);
            case TransitionState.STEP_2:
                return this.second(payload, cb);
            case TransitionState.STEP_3:
                return this.third(payload, cb);
            case TransitionState.STEP_4:
                return this.fourth(payload, cb);
            default:
                throw new KerberosError_1.default('Kerberos transition does not exist: ' + this.step);
        }
    }
    first(payload, cb) {
        this.client.step(payload, (error, challenge) => {
            if (error) {
                cb(error);
            }
            this.step = TransitionState.STEP_2;
            cb(null, challenge);
        });
    }
    second(payload, cb) {
        this.client.step(payload, (error, challenge) => {
            if (error) {
                if (this.attempts <= 0) {
                    return cb(error);
                }
                else {
                    this.attempts--;
                    return this.second(payload, cb);
                }
            }
            this.step = TransitionState.STEP_3;
            cb(null, challenge);
        });
    }
    third(payload, cb) {
        this.client.unwrap(payload, (error, data) => {
            if (error) {
                return cb(error);
            }
            const qop = Buffer.from(data, 'base64')[0];
            this.client.wrap(data, {
                user: this.options.username
            }, (error, response) => {
                if (error) {
                    return cb(error);
                }
                this.step = TransitionState.STEP_4;
                cb(null, response, qop);
            });
        });
    }
    fourth(payload, cb) {
        return cb(new KerberosError_1.default('Process finished'));
    }
}
exports.KerberosStep = KerberosStep;
//# sourceMappingURL=KerberosStep.js.map