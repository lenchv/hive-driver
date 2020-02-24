const { expect } = require('chai');
const TlsTransport = require('../../../../dist/connection/transports/TlsTransport').default;

const connectionMock = () => ({
    setMaxSendFragment() {},
    setNoDelay() {},
    addListener: (name, cb) => cb(name),
    removeListener: (name, cb) => cb(name),
    emit(name) { this.emitName = name; },
    end() { this.ended = true; },
});

describe('TlsTransport', () => {
    it('should be initiated correctly', () => {
        const transport = new TlsTransport('localhost', 443, {
            rejectUnauthorized: true,
            ca: 'ca',
            cert: 'cert',
            key: 'key'
        });

        expect(transport.host).to.be.eq('localhost');
        expect(transport.port).to.be.eq(443);
        expect(transport.tlsOptions.rejectUnauthorized).to.be.true;
        expect(transport.tlsOptions.ca).to.be.eq('ca');
        expect(transport.tlsOptions.cert).to.be.eq('cert');
        expect(transport.tlsOptions.key).to.be.eq('key');
    });

    it('should set certs and options', () => {
        const transport = new TlsTransport('localhost', 443, {});
        transport.setOptions('key', 'value')

        expect(transport.getOptions()).to.be.deep.eq({ key: 'value' });
    });

    it('should create connection correctly', () => {
        const transport = new TlsTransport('localhost', 443, {
            rejectUnauthorized: true
        });
        const connection = connectionMock();
        transport.tls = {
            connect(port, host, options) {
                expect(host).to.be.eq('localhost');
                expect(port).to.be.eq(443);
                expect(options.rejectUnauthorized).to.be.true;

                return connection;
            }
        };
        transport.connect();
        expect(transport.getTransport()).to.be.eq(connection);
    });

    it('should handle connect events correctly', () => {
        const transport = new TlsTransport('localhost', 443);
        const connection = connectionMock();
        transport.tls = {
            connect: () => connection
        };
        transport.connect();

        transport.addListener('connect', (eventName) => {
            expect(eventName).to.be.eq('secureConnect');
        });

        transport.emit('connect');
        expect(connection.emitName).to.be.eq('secureConnect');

        transport.removeListener('connect', (eventName) => {
            expect(eventName).to.be.eq('secureConnect');
        });
    });

    it('should handle the rest events correctly', () => {
        const transport = new TlsTransport('localhost', 443, {});
        const connection = connectionMock();
        transport.tls = {
            connect: () => connection
        };
        transport.connect();

        transport.addListener('data', (eventName) => {
            expect(eventName).to.be.eq('data');
        });

        transport.emit('data');
        expect(connection.emitName).to.be.eq('data');

        transport.removeListener('data', (eventName) => {
            expect(eventName).to.be.eq('data');
        });
    });

    it('should write data to connection correctly', () => {
        const transport = new TlsTransport('localhost', 443, null);
        transport.connection = {
            write(data) {
                expect(data).to.be.eq('data');
            }
        };

        transport.write('data');
    });

    it('should be ended correctly', () => {
        const transport = new TlsTransport('localhost', 443, {});
        const connection = connectionMock();
        transport.tls = {
            connect: () => connection
        };
        transport.connect();

        transport.end();

        expect(connection.ended).to.be.true;
    });
});
