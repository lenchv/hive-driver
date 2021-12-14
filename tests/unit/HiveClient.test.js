const { expect } = require('chai');
const HiveClient = require('../../dist/HiveClient').default;
const HiveSession = require('../../dist/HiveSession').default;
const { TCLIService_types, TCLIService } = require('../../').thrift;
const { auth: { NoSaslAuthentication }, connections: { TcpConnection } } = require('../../');

const ConnectionProviderMock = (connection) => ({
    connect(options, auth) {
        this.options = options;
        this.auth = auth;

        return Promise.resolve({
            getConnection() {
                return connection || {
                    on: () => {}
                };
            }
        });
    }
});

describe('HiveClient.connect', () => {
    it('should set nosal authenticatior by default', () => {
        const client = new HiveClient(TCLIService, TCLIService_types);
        const connectionProvider = ConnectionProviderMock();
    
        return client.connect({}, connectionProvider).catch(error => {
            expect(connectionProvider.auth).instanceOf(NoSaslAuthentication)
        });
    });

    it('should handle network errors', (cb) => {
        const client = new HiveClient(TCLIService, TCLIService_types);
        client.thrift = {
            createClient() {}
        };
        const connectionProvider = ConnectionProviderMock({
            on(name, handler) {
                handler(new Error('network error'));
            }
        });

        client.on('error', (error) => {
            expect(error.message).to.be.eq('network error');
            cb();
        });

        client.connect({}, connectionProvider).catch(error => {
           cb(error); 
        });
    });

    it('should use client auth provider', () => {
        const client = new HiveClient(TCLIService, TCLIService_types);
        client.thrift = {
            createClient() {}
        };
        const connectionProvider = ConnectionProviderMock();
        const customAuthProvider = {};

        client.connect({}, connectionProvider, customAuthProvider).then(() => {
            expect(client.authProvider).to.be.eq(customAuthProvider);
            expect(connectionProvider.auth).to.be.eq(customAuthProvider);
        });
    });

    it('should use tcp connection by default', (cb) => {
        const client = new HiveClient(TCLIService, TCLIService_types);
        client.thrift = {
            createClient() {}
        };

        client.on('error', (error) => {
            expect(client.connectionProvider).instanceOf(TcpConnection);
            cb();
        });

        client.connect({path: '', port: 0}).catch(cb);
    });
});

describe('HiveClient.openSession', () => {
    it('should successfully open session', () => {
        const client = new HiveClient(TCLIService, TCLIService_types);
        client.client = {
            OpenSession(req, cb) {
                cb(null, { status: {}, sessionHandle: {} });
            }
		};
		client.connection = {
            isConnected() {
				return true;
			}
        };
        return client.openSession({
            client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
        }).then((session) => {
            expect(session).instanceOf(HiveSession);
        });
	});
	
	it('should throw an exception when connection is lost', (done) => {
		const client = new HiveClient(TCLIService, TCLIService_types);
		client.connection = {
            isConnected() {
				return false;
			}
		};

		client.openSession({
			client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
		}).catch((error) => {
			expect(error.message).to.be.eq('HiveClient: connection is lost');
			done();
		});
	});
});

describe('HiveClient.getClient', () => {
    it('should throw error if client is not set', () => {
        const client = new HiveClient(TCLIService, TCLIService_types);
        expect(() => client.getClient()).to.throw('HiveClient: client is not initialized');
    });
});

describe('HiveClient.close', () => {
    it('should close connection if it was initiated', () => {
        const client = new HiveClient(TCLIService, TCLIService_types);
        let closed = false;
        client.connection = {
            getConnection: () => ({ end: () => {
                closed = true;
            }})
        };
        client.close();
        expect(closed).to.be.true;
    });

    it('should do nothing if connection does not exist', () => {
        const client = new HiveClient(TCLIService, TCLIService_types);
        client.close();
        expect(true).to.be.true;
    });

    it('should do nothing if connection exists but cannot be finished', () => {
        const client = new HiveClient(TCLIService, TCLIService_types);
        client.connection = {
            getConnection: () => ({})
        };
        client.close();
        expect(true).to.be.true;
    });
});
