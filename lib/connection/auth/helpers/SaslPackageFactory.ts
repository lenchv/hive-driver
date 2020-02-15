export enum StatusCode {
    START=1,
    OK=2,
    BAD=3,
    ERROR=4,
    COMPLETE=5,
};

export class SaslPackageFactory {
    static create(status: StatusCode, body: Buffer): Buffer {
        const bodyLength = new Buffer(4);

        bodyLength.writeUInt32BE(body.length, 0);

        return Buffer.concat([ Buffer.from([ status ]), bodyLength, body ]);
    }
}
