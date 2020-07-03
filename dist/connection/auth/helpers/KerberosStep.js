"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KerberosStep = void 0;
var KerberosError_1 = __importDefault(require("../../../errors/KerberosError"));
var TransitionState;
(function (TransitionState) {
    TransitionState[TransitionState["STEP_1"] = 0] = "STEP_1";
    TransitionState[TransitionState["STEP_2"] = 1] = "STEP_2";
    TransitionState[TransitionState["STEP_3"] = 2] = "STEP_3";
    TransitionState[TransitionState["STEP_4"] = 3] = "STEP_4";
})(TransitionState || (TransitionState = {}));
var KerberosStep = /** @class */ (function () {
    function KerberosStep(client, options) {
        this.step = TransitionState.STEP_1;
        this.client = client;
        this.attempts = 10;
        this.options = options;
    }
    KerberosStep.prototype.execute = function (payload, cb) {
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
    };
    KerberosStep.prototype.first = function (payload, cb) {
        var _this = this;
        this.client.step(payload, function (error, challenge) {
            if (error) {
                cb(error);
            }
            _this.step = TransitionState.STEP_2;
            cb(null, challenge);
        });
    };
    KerberosStep.prototype.second = function (payload, cb) {
        var _this = this;
        this.client.step(payload, function (error, challenge) {
            if (error) {
                if (_this.attempts <= 0) {
                    return cb(error);
                }
                else {
                    _this.attempts--;
                    return _this.second(payload, cb);
                }
            }
            _this.step = TransitionState.STEP_3;
            cb(null, challenge);
        });
    };
    KerberosStep.prototype.third = function (payload, cb) {
        var _this = this;
        this.client.unwrap(payload, function (error, data) {
            if (error) {
                return cb(error);
            }
            var qop = Buffer.from(data, 'base64')[0];
            _this.client.wrap(data, {
                user: _this.options.username
            }, function (error, response) {
                if (error) {
                    return cb(error);
                }
                _this.step = TransitionState.STEP_4;
                cb(null, response, qop);
            });
        });
    };
    KerberosStep.prototype.fourth = function (payload, cb) {
        return cb(new KerberosError_1.default('Process finished'));
    };
    return KerberosStep;
}());
exports.KerberosStep = KerberosStep;
//# sourceMappingURL=KerberosStep.js.map