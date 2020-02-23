const { expect } = require('chai');
const { TCLIService_types } = require('../../../').thrift;
const HiveDriver = require('../../../dist/hive/HiveDriver').default;

const toTitleCase = str => str[0].toUpperCase() + str.slice(1);

const testCommand = (command, request) => {
    const client = {};
    const driver = new HiveDriver(TCLIService_types, client);
    const response = { response: 'value' };
    client[toTitleCase(command)] = function (req, cb) {
        expect(req).to.be.deep.eq(new TCLIService_types[`T${toTitleCase(command)}Req`](request));
        cb(null, response);
    };
    return driver[command](request).then(resp => {
        expect(resp).to.be.deep.eq(response);
    });
};

describe('HiveDriver', () => {
    const sessionHandle = { sessionId: { guid: 'guid', secret: 'secret' } };
    const operationHandle = {
        operationId: { guid: 'guid', secret: 'secret' },
        operationType: '',
        hasResultSet: false
    };

    it('should execute closeSession', () => {
        return testCommand('closeSession', { sessionHandle });
    });

    it('should execute executeStatement', () => {
        return testCommand('executeStatement', { sessionHandle, statement: 'select * from t' });
    });

    it('should execute getResultSetMetadata', () => {
        return testCommand('getResultSetMetadata', { operationHandle });
    });

    it('should execute fetchResults', () => {
        return testCommand('fetchResults', { operationHandle, orientation: 1, maxRows: 100 });
    });

    it('should execute getInfo', () => {
        return testCommand('getInfo', { sessionHandle, infoType: 1 });
    });

    it('should execute getTypeInfo', () => {
        return testCommand('getTypeInfo', { sessionHandle });
    });

    it('should execute getCatalogs', () => {
        return testCommand('getCatalogs', { sessionHandle });
    });

    it('should execute getSchemas', () => {
        return testCommand('getSchemas', { sessionHandle });
    });

    it('should execute getTables', () => {
        return testCommand('getTables', { sessionHandle });
    });

    it('should execute getTableTypes', () => {
        return testCommand('getTableTypes', { sessionHandle });
    });

    it('should execute getColumns', () => {
        return testCommand('getColumns', { sessionHandle });
    });

    it('should execute getFunctions', () => {
        return testCommand('getFunctions', { sessionHandle, functionName: 'AVG' });
    });

    it('should execute getPrimaryKeys', () => {
        return testCommand('getPrimaryKeys', { sessionHandle });
    });

    it('should execute getCrossReference', () => {
        return testCommand('getCrossReference', { sessionHandle });
    });

    it('should execute getOperationStatus', () => {
        return testCommand('getOperationStatus', { operationHandle });
    });

    it('should execute cancelOperation', () => {
        return testCommand('cancelOperation', { operationHandle });
    });

    it('should execute closeOperation', () => {
        return testCommand('closeOperation', { operationHandle });
    });

    it('should execute getDelegationToken', () => {
        return testCommand('getDelegationToken', { sessionHandle, owner: 'owner', renewer: 'renewer' });
    });

    it('should execute cancelDelegationToken', () => {
        return testCommand('cancelDelegationToken', { sessionHandle, delegationToken: 'delegationToken' });
    });

    it('should execute renewDelegationToken', () => {
        return testCommand('renewDelegationToken', { sessionHandle, delegationToken: 'delegationToken' });
    });

    it('should execute getQueryId', () => {
        return testCommand('getQueryId', { operationHandle });
    });

    it('should execute setClientInfo', () => {
        return testCommand('setClientInfo', { sessionHandle });
    });
});
