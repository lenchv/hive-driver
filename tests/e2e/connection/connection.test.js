const { expect } = require('chai');
const process = require('process');
const logger = require('../utils/logger')(process.env.HIVE_E2E_LOG);
const instanceHelper = require('../utils/instanceHelper');
const { TCLIService, TCLIService_types } = require('../../../').thrift;
const driver = require('../../../');
const HiveClient = driver.HiveClient;
const auth = driver.auth;
const connections = driver.connections;

const runInstance = (authType, connectionType, logger) => {
    if (authType === 'kerberos') {
        return instanceHelper.upKrb(connectionType, logger);
    } else {
        return instanceHelper.up(connectionType, logger);
    }
};

const executeTest = (connect) => {
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
            expect(infoResponse.getValue()).to.eq('2.3.6');
        }).then(() => {
            return session.close();
        }, err => {
            return session.close().then(() => Promise.reject(err));
        });
    });
};

const runConnectionTest = (connect, connectionType, logger) => {
    return runInstance('', connectionType, logger).then(() => {
        return executeTest(connect);
    });
};

const runKerberosConnectionTest = (connect, connectionType, logger) => {
    return runInstance('kerberos', connectionType, logger).then(() => {
        return executeTest(connect);
    });
};

const reloadConnectionTest = (connect, connectionType, logger) => {
    return instanceHelper.reload(connectionType, logger).then(() => {
        return executeTest(connect);
    });
};

const stopInstance = () => instanceHelper.down(logger);

const sleep = (t) => new Promise((resolve) => {
    setTimeout(resolve, t);
});

describe('Driver should connect to Hive via', function () {
    this.timeout(1000 * 60 * 5);

    describe('nosasl', () => {
        it('tcp', () => {
            return runConnectionTest(require('./connections/tcp.nosasl'), 'tcp.nosasl', logger);
        });
    
        it('tcp SSL', () => {
            return reloadConnectionTest(require('./connections/tcp.nosasl.ssl'), 'tcp.nosasl.ssl', logger);
        });
    
        it('http', () => {
            return reloadConnectionTest(require('./connections/http.nosasl'), 'http.nosasl', logger);
        });
    
        it('http SSL', () => {
            return reloadConnectionTest(require('./connections/http.nosasl.ssl'), 'http.nosasl.ssl', logger);
        });
    });
    
    describe('plain', () => {
        it('tcp', () => {
            return reloadConnectionTest(require('./connections/tcp.plain'), 'tcp.plain', logger);
        });

        it('tcp SSL', () => {
            return reloadConnectionTest(require('./connections/tcp.plain.ssl'), 'tcp.plain.ssl', logger);
        });

        it('http', () => {
            return reloadConnectionTest(require('./connections/http.plain'), 'http.plain', logger);
        });

        it('http SSL', () => {
            return reloadConnectionTest(require('./connections/http.plain.ssl'), 'http.plain.ssl', logger);
        });
    });

    describe('ldap', () => {
        after(stopInstance);
        it('tcp', () => {
            return reloadConnectionTest(require('./connections/tcp.ldap'), 'tcp.ldap', logger);
        });

        it('http', () => {
            return reloadConnectionTest(require('./connections/http.ldap'), 'http.ldap', logger);
        });
    });

    describe('kerberos', () => {
        after(stopInstance);
        it('tcp', () => {
            return runKerberosConnectionTest(require('./connections/tcp.kerberos'), 'tcp.kerberos', logger);
        });

        it('http', () => {
            return reloadConnectionTest(require('./connections/http.kerberos'), 'http.kerberos', logger);
        });

        it('tcp SSL', () => {
            return reloadConnectionTest(require('./connections/tcp.kerberos.ssl'), 'tcp.kerberos.ssl', logger);
        });

        it('http SSL', () => {
            return reloadConnectionTest(require('./connections/http.kerberos.ssl'), 'http.kerberos.ssl', logger);
        });
    });
});
