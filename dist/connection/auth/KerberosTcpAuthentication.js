"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SaslPackageFactory_1 = require("./helpers/SaslPackageFactory");
var QOP;
(function (QOP) {
    QOP[QOP["AUTH"] = 1] = "AUTH";
    QOP[QOP["AUTH_INTEGRITY"] = 2] = "AUTH_INTEGRITY";
    QOP[QOP["AUTH_CONFIDENTIALITY"] = 4] = "AUTH_CONFIDENTIALITY";
})(QOP || (QOP = {}));
var KerberosAuthProcess = /** @class */ (function () {
    function KerberosAuthProcess(host, service) {
    }
    KerberosAuthProcess.prototype.init = function (username, password, cb) {
        cb(null, this.client);
    };
    KerberosAuthProcess.prototype.transition = function (payload, cb) {
        cb(null, payload);
    };
    return KerberosAuthProcess;
}());
var KerberosTcpAuthentication = /** @class */ (function () {
    function KerberosTcpAuthentication(options, authProcess) {
        var _a, _b, _c;
        this.username = ((_a = options) === null || _a === void 0 ? void 0 : _a.username) || 'anonymous';
        this.password = ((_b = options) === null || _b === void 0 ? void 0 : _b.password) !== undefined ? (_c = options) === null || _c === void 0 ? void 0 : _c.password : 'anonymous';
        this.authProcess = authProcess;
    }
    KerberosTcpAuthentication.prototype.authenticate = function (transport) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var transition = 0;
            var qualityOfProtection = QOP.AUTH;
            _this.authProcess.init(_this.username, _this.password, function (error, client) {
                if (error) {
                    return reject(error);
                }
                var onError = function (err) {
                    transport.end();
                    reject(err);
                };
                var onSuccess = function () {
                    transport.removeListener('connect', onConnect);
                    transport.removeListener('data', onData);
                    resolve(transport);
                };
                var onConnect = function () {
                    _this.onConnect(transport).catch(onError);
                };
                var onData = function (data) {
                    transition++;
                    var status = data[0];
                    if (status === SaslPackageFactory_1.StatusCode.OK) {
                        var payload = data.slice(5).toString('base64');
                        if (transition < 2) {
                            _this.nextTransition(transport, payload).catch(onError);
                        }
                        else {
                            _this.thirdTransition(transport, client, payload).then(function (qop) {
                                qualityOfProtection = qop;
                            }).catch(onError);
                        }
                    }
                    else if (status === SaslPackageFactory_1.StatusCode.COMPLETE) {
                        onSuccess();
                    }
                    else {
                        var message = data.slice(5).toString();
                        onError(new Error('Authenticated error: ' + message));
                    }
                };
                transport.connect();
                transport.addListener('connect', onConnect);
                transport.addListener('data', onData);
                transport.addListener('error', onError);
            });
        });
    };
    KerberosTcpAuthentication.prototype.onConnect = function (transport) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.START, Buffer.from(KerberosTcpAuthentication.AUTH_MECH)));
            _this.authProcess.transition('', function (err, token) {
                if (err) {
                    return reject(err);
                }
                transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.OK, Buffer.from(token || '', 'base64')));
                resolve();
            });
        });
    };
    KerberosTcpAuthentication.prototype.nextTransition = function (transport, payload) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.authProcess.transition(payload, function (err, response) {
                if (err) {
                    return reject(err);
                }
                transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.OK, Buffer.from(response || '', 'base64')));
                resolve();
            });
        });
    };
    KerberosTcpAuthentication.prototype.thirdTransition = function (transport, client, payload) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            client.unwrap(payload, function (err, response) {
                if (err) {
                    return reject(err);
                }
                var qop = Buffer.from(response, 'base64')[0];
                client.wrap(response, { user: _this.username }, function (err, wrapped) {
                    if (err) {
                        return reject(err);
                    }
                    transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.OK, Buffer.from(wrapped || '', 'base64')));
                    resolve(qop);
                });
            });
        });
    };
    KerberosTcpAuthentication.AUTH_MECH = 'GSSAPI';
    return KerberosTcpAuthentication;
}());
exports.default = KerberosTcpAuthentication;
//# sourceMappingURL=KerberosTcpAuthentication.js.map