const { expect } = require('chai');
const KerberosHttpAuthentication = require('../../../../dist/connection/auth/KerberosHttpAuthentication').default;

describe('KerberosHttpAuthentication', () => {
    it('should set parameters correctly', () => {
        const authProcess = {};
        const krbHttp = new KerberosHttpAuthentication({
            username: 'user',
            password: 'pass',
            headers: {
                'Content-Type': 'application/json'
            },
        }, authProcess);
        expect(krbHttp.username).to.be.eq('user');
        expect(krbHttp.password).to.be.eq('pass');
        expect(krbHttp.headers).to.be.deep.eq({
            'Content-Type': 'application/json'
        });
        expect(krbHttp.authProcess).to.be.deep.eq(authProcess);
    });

    it('should set default parameters', () => {
        const authProcess = {};
        const krbHttp = new KerberosHttpAuthentication(undefined, authProcess);
        expect(krbHttp.username).to.be.eq('anonymous');
        expect(krbHttp.password).to.be.eq('anonymous');
        expect(krbHttp.headers).to.be.deep.eq({});
        expect(krbHttp.authProcess).to.be.deep.eq(authProcess);
    });

    it('should authenticate', () => {
        const authProcess = {
            init(params, cb) {
                cb(null, {
                    step(payload, cb) {
                        cb(null, 'token');
                    }
                });
            }
        };
        const transport = {
            options: {},
            setOptions(name, value) {
                this.options[name] = value;
            }
        }
        const krbHttp = new KerberosHttpAuthentication({}, authProcess);
        
        return krbHttp.authenticate(transport).then(t => {
            expect(t.options).to.be.deep.eq({
                headers: {
                    Authorization: 'Negotiate : token'
                }
            });
        });
    });

    it('should throw error when client is initiated', () => {
        const authProcess = {
            init(params, cb) {
                cb(new Error('error'));
            }
        };
        const krbHttp = new KerberosHttpAuthentication({}, authProcess);
        krbHttp.authenticate({}).catch(error => {
            expect(error.message).to.be.eq('error');
        });
    });

    it('should throw error when step is failed', () => {
        const authProcess = {
            init(params, cb) {
                cb(null, {
                    step(payload, cb) {
                        cb(new Error('error'));
                    }
                });
            }
        };
        const krbHttp = new KerberosHttpAuthentication({}, authProcess);
        krbHttp.authenticate({}).catch(error => {
            expect(error.message).to.be.eq('error');
        });
    });
});
