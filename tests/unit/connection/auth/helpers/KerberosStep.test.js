const { expect } = require('chai');
const KerberosStep = require('../../../../../dist/connection/auth/helpers/KerberosStep').KerberosStep;

describe('KerberosStep', () => {
    it('should proceed all steps', () => {
        let cursor = 0;
        const transitions = [
            [ '', 'transition1' ],
            [ 'transition2', 'transition2' ],
            [ 'transition3', Buffer.from([1, 0, 0, 0]).toString('base64') ],
        ];

        const step = new KerberosStep({
            step(payload, cb) {
                const data = transitions[cursor++];
                expect(payload).to.be.eq(data[0]);
                cb(null, data[1]);
            },
            unwrap(payload, cb) {
                const data = transitions[cursor];
                expect(payload).to.be.eq(data[0]);
                cb(null, data[1]);
            },
            wrap(payload, data, cb) {
                expect(data.user).to.be.eq('hive@KERBEROS.SERVER');
                expect(payload).to.be.eq(transitions[cursor][1]);

                cb(null, 'transition3');
            },
        }, {
            username: 'hive@KERBEROS.SERVER'
        });

        step.execute('', (error, data) => {
            expect(error).to.be.null;
            expect(data).to.be.eq('transition1');
        });

        step.execute('transition2', (error, data) => {
            expect(error).to.be.null;
            expect(data).to.be.eq('transition2');
        });

        step.execute('transition3', (error, data) => {
            expect(error).to.be.null;
            expect(data).to.be.eq('transition3');
        });

        step.execute('transition4', (error, data) => {
            expect(error.message).to.be.eq('Process finished');
        });
    });
});
