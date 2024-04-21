"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiveUtils = exports.HiveDriver = exports.HiveClient = exports.thrift = exports.connections = exports.auth = void 0;
const TCLIService = require('../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../thrift/gen-nodejs/TCLIService_types');
const HiveClient_1 = __importDefault(require("./HiveClient"));
const HiveDriver_1 = __importDefault(require("./hive/HiveDriver"));
const HiveUtils_1 = __importDefault(require("./utils/HiveUtils"));
const NoSaslAuthentication_1 = __importDefault(require("./connection/auth/NoSaslAuthentication"));
const PlainTcpAuthentication_1 = __importDefault(require("./connection/auth/PlainTcpAuthentication"));
const PlainHttpAuthentication_1 = __importDefault(require("./connection/auth/PlainHttpAuthentication"));
const KerberosTcpAuthentication_1 = __importDefault(require("./connection/auth/KerberosTcpAuthentication"));
const KerberosHttpAuthentication_1 = __importDefault(require("./connection/auth/KerberosHttpAuthentication"));
const MongoKerberosAuthProcess_1 = __importDefault(require("./connection/auth/helpers/MongoKerberosAuthProcess"));
const HttpConnection_1 = __importDefault(require("./connection/connections/HttpConnection"));
const TcpConnection_1 = __importDefault(require("./connection/connections/TcpConnection"));
exports.auth = {
    helpers: {
        MongoKerberosAuthProcess: MongoKerberosAuthProcess_1.default
    },
    NoSaslAuthentication: NoSaslAuthentication_1.default,
    PlainTcpAuthentication: PlainTcpAuthentication_1.default,
    PlainHttpAuthentication: PlainHttpAuthentication_1.default,
    KerberosTcpAuthentication: KerberosTcpAuthentication_1.default,
    KerberosHttpAuthentication: KerberosHttpAuthentication_1.default,
};
exports.connections = {
    HttpConnection: HttpConnection_1.default,
    TcpConnection: TcpConnection_1.default
};
exports.thrift = {
    TCLIService,
    TCLIService_types
};
class HiveClient extends HiveClient_1.default {
}
exports.HiveClient = HiveClient;
class HiveDriver extends HiveDriver_1.default {
}
exports.HiveDriver = HiveDriver;
class HiveUtils extends HiveUtils_1.default {
}
exports.HiveUtils = HiveUtils;
//# sourceMappingURL=index.js.map