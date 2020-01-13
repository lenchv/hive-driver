export enum StatusCode {
    START=1,
    OK=2,
    BAD=3,
    ERROR=4,
    COMPLETE=5,
};

export default class AuthHelper {
    static createPackage(status: StatusCode, body: Buffer) {
        const bodyLength = new Buffer(4);

        bodyLength.writeUInt32BE(body.length, 0);

        return Buffer.concat([ new Buffer([ status ]), bodyLength, body ]);
    }
}
