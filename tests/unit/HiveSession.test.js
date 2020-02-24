const { expect } = require('chai');
const { TCLIService_types } = require('../..').thrift;
const HiveSession = require('../../dist/HiveSession').default;
const InfoValue = require('../../dist/dto/InfoValue').default;
const Status = require('../../dist/dto/Status').default;
const HiveOperation = require('../../dist/HiveOperation').default;

const testMethod = (methodName, parameters, delegationToken) => {
    const driver = {
        [methodName]: () => Promise.resolve({
            status: {
                statusCode: 0
            },
            operationHandle: 'operationHandle',
            infoValue: {},
            delegationToken
        })
    };
    const session = new HiveSession(driver, { sessionId: 'id' }, TCLIService_types);    
    
    return session[methodName].apply(session, parameters);
};

describe('HiveSession', () => {
    it('getInfo', () => {
        return testMethod('getInfo', [ 1 ]).then(result => {
            expect(result).instanceOf(InfoValue);
        })
    });
    it('executeStatement', () => {
        return testMethod('executeStatement', [ 'select * from table', { runAsync: true } ]).then(result => {
            expect(result).instanceOf(HiveOperation);
        }).then(() => {
            return testMethod('executeStatement', [ 'select * from table' ]);
        }).then(result => {
            expect(result).instanceOf(HiveOperation);
        });
    });
    it('getTypeInfo', () => {
        return testMethod('getTypeInfo', []).then(result => {
            expect(result).instanceOf(HiveOperation);
        })
    });
    it('getCatalogs', () => {
        return testMethod('getCatalogs', []).then(result => {
            expect(result).instanceOf(HiveOperation);
        })
    });
    it('getSchemas', () => {
        return testMethod('getSchemas', [{
            catalogName: 'catalog',
            schemaName: 'schema'
        }]).then(result => {
            expect(result).instanceOf(HiveOperation);
        })
    });
    it('getTables', () => {
        return testMethod('getTables', [{
            catalogName: 'catalog',
            schemaName: 'default',
            tableName: 't1',
            tableTypes: ['external']
        }]).then(result => {
            expect(result).instanceOf(HiveOperation);
        })
    });
    it('getTableTypes', () => {
        return testMethod('getTableTypes', []).then(result => {
            expect(result).instanceOf(HiveOperation);
        })
    });
    it('getColumns', () => {
        return testMethod('getColumns', [{
            catalogName: 'catalog',
            schemaName: 'schema',
            tableName: 'table',
            columnName: 'column'
        }]).then(result => {
            expect(result).instanceOf(HiveOperation);
        })
    });
    it('getFunctions', () => {
        return testMethod('getFunctions', [{
            catalogName: 'catalog',
            schemaName: 'schema',
            functionName: 'avg'
        }]).then(result => {
            expect(result).instanceOf(HiveOperation);
        })
    });
    it('getPrimaryKeys', () => {
        return testMethod('getPrimaryKeys', [{
            catalogName: 'catalog',
            schemaName: 'schema',
            tableName: 't1'
        }]).then(result => {
            expect(result).instanceOf(HiveOperation);
        })
    });
    it('getCrossReference', () => {
        return testMethod('getCrossReference', [{
            parentCatalogName: 'parentCatalogName',
            parentSchemaName: 'parentSchemaName',
            parentTableName: 'parentTableName',
            foreignCatalogName: 'foreignCatalogName',
            foreignSchemaName: 'foreignSchemaName',
            foreignTableName: 'foreignTableName',
        }]).then(result => {
            expect(result).instanceOf(HiveOperation);
        })
    });
    it('getDelegationToken', () => {
        return testMethod('getDelegationToken', ['owner', 'renewer'], 'token').then(result => {
            expect(result).to.be.eq('token');
        }).then(() => {
            return testMethod('getDelegationToken', ['owner', 'renewer'])
        }).then(result => {
            expect(result).to.be.eq('');
        });
    });
    it('renewDelegationToken', () => {
        return testMethod('renewDelegationToken', ['token']).then(result => {
            expect(result).instanceOf(Status);
        })
    });
    it('cancelDelegationToken', () => {
        return testMethod('cancelDelegationToken', ['token']).then(result => {
            expect(result).instanceOf(Status);
        })
    });

    it('close', () => {
        const driver = {
            closeSession: () => Promise.resolve({
                status: {
                    statusCode: 0
                }
            })
        };
        const session = new HiveSession(driver, { sessionId: 'id' }, TCLIService_types);    
        
        return session.close().then(result => {
            expect(result).instanceOf(Status);
        });
    });
});
