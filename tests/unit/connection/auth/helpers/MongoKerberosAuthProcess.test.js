const { expect } = require('chai');
const { KerberosStep } = require('../../../../../dist/connection/auth/helpers/KerberosStep');
const MongoKerberosAuthProcess = require('../../../../../dist/connection/auth/helpers/MongoKerberosAuthProcess').default;

const mongoDbKerberosMock = (error = null) => ({
    GSS_MECH_OID_SPNEGO: 1,
    GSS_C_NO_OID: 2,
    initializeClient(spn, options, cb) {
        this.spn = spn;
        this.options = options;
        cb(error, {
            wrap(payload, data, cb) { cb(null, payload); },
            unwrap(payload, cb) { cb(null, payload); },
            step(payload, cb) { cb(null, payload, 4); }
        });
    },
});

describe('MongoKerberosAuthProcess', () => {
    it('should be initiated', () => {
        const kerberos = mongoDbKerberosMock();
        const mongoProcess = new MongoKerberosAuthProcess({
            fqdn: 'hive.driver',
            service: 'hive'
        }, kerberos);
        mongoProcess.init({
            username: 'user@REALM',
            password: 'user',
            http: false
        }, (error, client) => {
            expect(kerberos.options.mechOID).to.be.eq(kerberos.GSS_C_NO_OID);
            expect(kerberos.options.domain).to.be.eq('hive.driver');
            expect(kerberos.options.user).to.be.eq('user@REALM');
            expect(kerberos.options.password).to.be.eq('user');
            expect(kerberos.spn).to.be.eq(process.platform === 'win32' ? 'hive/hive.driver' : 'hive@hive.driver');
            expect(mongoProcess.kerberosStep).instanceOf(KerberosStep);
        });
    });

    it('should be initiated as SPNEGO with win32 spn', () => {
        const kerberos = mongoDbKerberosMock();
        const mongoProcess = new MongoKerberosAuthProcess({
            fqdn: 'hive.driver',
            service: 'hive'
        }, kerberos);
        mongoProcess.platform = 'win32';
        mongoProcess.init({
            username: 'user@REALM',
            password: 'user',
            http: true
        }, (error, client) => {
            expect(kerberos.options.mechOID).to.be.eq(kerberos.GSS_MECH_OID_SPNEGO);
            expect(kerberos.spn).to.be.eq('hive/hive.driver');
        });
    });

    it('should return error during initiation', () => {
        const kerberos = mongoDbKerberosMock(new Error('error'));
        const mongoProcess = new MongoKerberosAuthProcess({
            fqdn: 'hive.driver',
            service: 'hive'
        }, kerberos);
        mongoProcess.init({
            username: 'user@REALM',
            password: 'user'
        }, (error, client) => {
            expect(error.message).to.be.eq('error');
        });
    });

    it('should throw error if client is not initiated', () => {
        const kerberos = mongoDbKerberosMock();
        const mongoProcess = new MongoKerberosAuthProcess({
            fqdn: 'hive.driver',
            service: 'hive'
        }, kerberos);

        expect(() => {
            mongoProcess.transition('', () => {});
        }).to.throw('Kerberos client is not initialized');
    });

    it('should pass transtion', () => {
        const kerberos = mongoDbKerberosMock();
        const mongoProcess = new MongoKerberosAuthProcess({
            fqdn: 'hive.driver',
            service: 'hive'
        }, kerberos);
        mongoProcess.kerberosStep = {
            execute(payload, cb) {
                expect(payload).to.be.eq('payload');
                cb(null, 'challenge', 4);
            }
        };
        mongoProcess.transition('payload', (error, challenge) => {
            expect(error).to.be.null;
            expect(challenge).to.be.eq('challenge');
            expect(mongoProcess.getQOP()).to.be.eq(4);
        });
    });

    it('should return error in transtion', () => {
        const kerberos = mongoDbKerberosMock();
        const mongoProcess = new MongoKerberosAuthProcess({
            fqdn: 'hive.driver',
            service: 'hive'
        }, kerberos);
        mongoProcess.kerberosStep = {
            execute(payload, cb) {
                cb(new Error('error'));
            }
        };
        mongoProcess.transition('payload', (error, challenge) => {
            expect(error.message).to.be.eq('error');
        });
    });

    it('should not initiate qop', () => {
        const kerberos = mongoDbKerberosMock();
        const mongoProcess = new MongoKerberosAuthProcess({
            fqdn: 'hive.driver',
            service: 'hive'
        }, kerberos);
        mongoProcess.kerberosStep = {
            execute(payload, cb) {
                cb(null, 'challenge');
            }
        };
        mongoProcess.transition('payload', (error, challenge) => {
            expect(mongoProcess.getQOP()).to.be.eq(1);
        });
    });
});
