const { expect } = require('chai');
const process = require('process');
const logger = require('../utils/logger')(process.env.HIVE_E2E_LOG);
const instanceHelper = require('../utils/instanceHelper');
const TCLIService = require('../../../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../../../thrift/gen-nodejs/TCLIService_types');
const driver = require('../../../index');
const HiveClient = driver.HiveClient;
const auth = driver.auth;
const connections = driver.connections;

const runConnectionTest = (connect, connectionType, logger) => {
    return instanceHelper.up(connectionType, logger).then(() => {
        return connect(
            new HiveClient(
                TCLIService,
                TCLIService_types
            ),
            connections,
            auth
        ).then(client => {
            return client.openSession({
                client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
            });
        }).then(session => {
            return session.getInfo(TCLIService_types.TGetInfoType.CLI_DBMS_VER).then(infoResponse => {
                expect(infoResponse.status.success()).to.be.true;
                expect(infoResponse.value.getValue()).to.eq('2.3.6');
            }).then(() => {
                return session.close();
            }, err => {
                return session.close().then(() => Promise.error(err));
            });
        });
    }).then(() => {
        return instanceHelper.down(logger);
    }).catch(err => {
        return instanceHelper.down(logger).then(() => Promise.reject(err));
    });
};

describe('Driver should connect to Hive via', function () {
    this.timeout(1000 * 60 * 5);

    describe('nosasl', () => {
        it('tcp', () => {
            return runConnectionTest(require('./connections/tcp.nosasl'), 'tcp.nosasl', logger);
        });
    
        it('tcp SSL', () => {
            return runConnectionTest(require('./connections/tcp.nosasl.ssl'), 'tcp.nosasl.ssl', logger);
        });
    
        it('http', () => {
            return runConnectionTest(require('./connections/http.nosasl'), 'http.nosasl', logger);
        });
    
        it('http SSL', () => {
            return runConnectionTest(require('./connections/http.nosasl.ssl'), 'http.nosasl.ssl', logger);
        });
    });
    
    describe('plain', () => {
        it('tcp', () => {
            return runConnectionTest(require('./connections/tcp.plain'), 'tcp.plain', logger);
        });

        it('tcp SSL', () => {
            return runConnectionTest(require('./connections/tcp.plain.ssl'), 'tcp.plain.ssl', logger);
        });

        it('http', () => {
            return runConnectionTest(require('./connections/http.plain'), 'http.plain', logger);
        });

        it('http SSL', () => {
            return runConnectionTest(require('./connections/http.plain.ssl'), 'http.plain.ssl', logger);
        });
    });

    describe('ldap', () => {
        it('tcp', () => {
            return runConnectionTest(require('./connections/tcp.ldap'), 'tcp.ldap', logger);
        });

        it('http', () => {
            return runConnectionTest(require('./connections/http.ldap'), 'http.ldap', logger);
        });
    });
});