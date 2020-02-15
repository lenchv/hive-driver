const { expect } = require('chai');
const PlainTcpAuthentication = require('../../../../dist/connection/auth/PlainTcpAuthentication').default;

const getTransportMock = () => {
    let cursor = 0;
    let dataChecks = [
        (data) => {
            expect(data.toString()).to.be.eq(Buffer.concat([
                Buffer.from([ 1, 0, 0, 0, 5 ]),
                Buffer.from('PLAIN')
            ]).toString());
        },
        (data) => {
            expect(data.toString()).to.be.eq(Buffer.concat([
                Buffer.from([ 2, 0, 0, 0, 29 ]),
                Buffer.from('anonymous'),
                Buffer.from([0]),
                Buffer.from('anonymous'),
                Buffer.from([0]),
                Buffer.from('anonymous'),
            ]).toString());
        },
    ];

    return {
        listeners: {},
        connect() {},
        addListener(name, cb) {
            this.listeners[name] = cb;
        },
        write(data) {
            dataChecks[cursor](data);
            cursor++;
        },
        removeListener() {},
        end() {},
    };
};

describe('PlainTcpAuthentication', () => {
    it('username and password must be anonymous if nothing passed', () => {
        const auth = new PlainTcpAuthentication();

        expect(auth.username).to.be.eq('anonymous');
        expect(auth.password).to.be.eq('anonymous');
    });

    it('username and password must be defined correctly', () => {
        const auth = new PlainTcpAuthentication({
            username: 'user',
            password: 'pass'
        });

        expect(auth.username).to.be.eq('user');
        expect(auth.password).to.be.eq('pass');
    });

    it('empty password must be set', () => {
        const auth = new PlainTcpAuthentication({
            username: 'user',
            password: ''
        });

        expect(auth.username).to.be.eq('user');
        expect(auth.password).to.be.eq('');
    });

    it('user must be authenticated successfully', () => {
        const auth = new PlainTcpAuthentication();
        const transportMock = getTransportMock();
        const result = auth.authenticate(transportMock);

        return Promise.resolve().then(() => {
            transportMock.listeners.connect();
        }).then(() => {
            transportMock.listeners.data(Buffer.from([ 5 ]));

            return result;
        }).then((transport) => {
            expect(transport).to.be.eq(transportMock);
        });
    });

    it('the error must be thrown if response incorrect', () => {
        const auth = new PlainTcpAuthentication();
        const transportMock = getTransportMock();
        const result = auth.authenticate(transportMock);

        return Promise.resolve().then(() => {
            transportMock.listeners.connect();
        }).then(() => {
            transportMock.listeners.data(Buffer.concat([
                Buffer.from([ 4, 0, 0, 0, 10 ]),
                Buffer.from('auth error')
            ]));

            return result;
        }).catch((error) => {
            expect(error.message).to.be.eq('Authentication error: auth error');
        });
    });
});
