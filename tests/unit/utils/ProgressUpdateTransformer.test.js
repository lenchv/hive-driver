const { expect } = require('chai');
const ProgressUpdateTransformer = require('../../../dist/utils/ProgressUpdateTransformer').default;

describe('ProgressUpdateTransformer', () => {
    it('should have equal columns', () => {
        const t = new ProgressUpdateTransformer();

        expect(t.formatRow(['Column 1', 'Column 2'])).to.be.eq('Column 1  |Column 2  ');
    });

    it('should format response as table', () => {
        const t = new ProgressUpdateTransformer({
            headerNames: ['Column 1', 'Column 2'],
            rows: [
                [ 'value 1.1', 'value 1.2' ],
                [ 'value 2.1', 'value 2.2' ]
            ],
            footerSummary: 'footer'
        });

        expect(String(t)).to.be.eq(
            'Column 1  |Column 2  \n' +
            'value 1.1 |value 1.2 \n' +
            'value 2.1 |value 2.2 \n' +
            'footer'
        );
    });
});
